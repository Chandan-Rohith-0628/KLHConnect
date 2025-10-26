import Club from '../models/Club.js';
import User from '../models/User.js';

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
export const getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .populate('president vicePresident faculty', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
export const getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president vicePresident faculty', 'name email')
      .populate('members.user', 'name email department year')
      .populate('gallery.uploadedBy', 'name')
      .populate('resources.uploadedBy', 'name')
      .populate('forumPosts.user', 'name profilePicture');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create club
// @route   POST /api/clubs
// @access  Private (Admin)
export const createClub = async (req, res, next) => {
  try {
    const club = await Club.create(req.body);

    res.status(201).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private (Admin)
export const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin)
export const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    await club.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join club
// @route   POST /api/clubs/:id/join
// @access  Private
export const joinClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check if already a member
    const isMember = club.members.some(
      member => member.user.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this club'
      });
    }

    // Add member
    club.members.push({ user: req.user.id });
    await club.save();

    // Add club to user's registered clubs
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { registeredClubs: club._id }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully joined club',
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave club
// @route   POST /api/clubs/:id/leave
// @access  Private
export const leaveClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Remove member
    club.members = club.members.filter(
      member => member.user.toString() !== req.user.id
    );
    await club.save();

    // Remove club from user's registered clubs
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { registeredClubs: club._id }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully left club'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload gallery images
// @route   POST /api/clubs/:id/gallery
// @access  Private
export const uploadGalleryImages = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Add images to gallery
    const images = req.files.map(file => ({
      url: `/uploads/clubs/${file.filename}`,
      caption: req.body.caption || '',
      uploadedBy: req.user.id
    }));

    club.gallery.push(...images);
    await club.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: club.gallery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resource
// @route   POST /api/clubs/:id/resources
// @access  Private
export const uploadResource = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Add resource
    club.resources.push({
      name: req.body.name || req.file.originalname,
      url: `/uploads/resources/${req.file.filename}`,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      uploadedBy: req.user.id
    });

    await club.save();

    res.status(200).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: club.resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post forum message
// @route   POST /api/clubs/:id/forum
// @access  Private
export const postForumMessage = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Add forum post
    club.forumPosts.unshift({
      user: req.user.id,
      message: req.body.message
    });

    await club.save();

    // Populate user info
    await club.populate('forumPosts.user', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Message posted successfully',
      data: club.forumPosts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get club members
// @route   GET /api/clubs/:id/members
// @access  Private (Admin)
export const getClubMembers = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('members.user', 'name email department year phone');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      count: club.members.length,
      data: club.members
    });
  } catch (error) {
    next(error);
  }
};
