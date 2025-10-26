import LostFound from '../models/LostFound.js';

// @desc    Get all lost & found items
// @route   GET /api/lost-found
// @access  Public
export const getItems = async (req, res, next) => {
  try {
    const { type, category, status, search } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const items = await LostFound.find(query)
      .populate('postedBy', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/lost-found/:id
// @access  Public
export const getItem = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id)
      .populate('postedBy', 'name email phone')
      .populate('claims.claimedBy', 'name email phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report lost/found item
// @route   POST /api/lost-found
// @access  Private
export const createItem = async (req, res, next) => {
  try {
    req.body.postedBy = req.user.id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/lost-found/${file.filename}`);
    }

    const item = await LostFound.create(req.body);

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/lost-found/:id
// @access  Private
export const updateItem = async (req, res, next) => {
  try {
    let item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/lost-found/${file.filename}`);
      req.body.images = [...(item.images || []), ...newImages];
    }

    item = await LostFound.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/lost-found/:id
// @access  Private
export const deleteItem = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership or admin
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim item
// @route   POST /api/lost-found/:id/claim
// @access  Private
export const claimItem = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Item is no longer available for claiming'
      });
    }

    // Check if already claimed by this user
    const alreadyClaimed = item.claims.some(
      claim => claim.claimedBy.toString() === req.user.id
    );

    if (alreadyClaimed) {
      return res.status(400).json({
        success: false,
        message: 'You have already claimed this item'
      });
    }

    // Add claim
    item.claims.push({
      claimedBy: req.user.id,
      message: req.body.message
    });

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Claim submitted successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim status
// @route   PUT /api/lost-found/:id/claim/:claimId
// @access  Private (Admin)
export const updateClaimStatus = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const claim = item.claims.id(req.params.claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    claim.status = req.body.status;

    // If approved, mark item as claimed
    if (req.body.status === 'approved') {
      item.status = 'claimed';
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Claim status updated',
      data: item
    });
  } catch (error) {
    next(error);
  }
};
