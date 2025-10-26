import Feedback from '../models/Feedback.js';

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Faculty/Admin)
export const getAllFeedback = async (req, res, next) => {
  try {
    const { category, status, priority } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const feedback = await Feedback.find(query)
      .populate('submittedBy', 'name email department year')
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's feedback
// @route   GET /api/feedback/my
// @access  Private
export const getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ submittedBy: req.user.id })
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('submittedBy', 'name email department year')
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name email');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is authorized to view
    if (
      feedback.submittedBy._id.toString() !== req.user.id &&
      req.user.role !== 'faculty' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this feedback'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (req, res, next) => {
  try {
    req.body.submittedBy = req.user.id;

    const feedback = await Feedback.create(req.body);

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback status
// @route   PUT /api/feedback/:id
// @access  Private (Faculty/Admin)
export const updateFeedbackStatus = async (req, res, next) => {
  try {
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const { status, priority, assignedTo } = req.body;

    if (status) feedback.status = status;
    if (priority) feedback.priority = priority;
    if (assignedTo) feedback.assignedTo = assignedTo;

    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to feedback
// @route   POST /api/feedback/:id/respond
// @access  Private (Faculty/Admin)
export const respondToFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    feedback.responses.push({
      message: req.body.message,
      respondedBy: req.user.id
    });

    // Update status to in-progress if pending
    if (feedback.status === 'pending') {
      feedback.status = 'in-progress';
    }

    await feedback.save();

    // Populate response
    await feedback.populate('responses.respondedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};
