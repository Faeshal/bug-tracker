require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const User = require("../models").user;
const Card = require("../models").card;
const Project = require("../models").project;
const _ = require("underscore");
const { ErrorResponse } = require("../middleware/errorHandler");
const publisher = require("../event/publisher/index");
const log = require("log4js").getLogger("card");
log.level = "info";

// * @route POST /api/v1/projects/cards
// @desc    create new card
// @access  Private[user]
exports.createCard = asyncHandler(async (req, res, next) => {
  var { name, content, projectId } = req.body;
  const { id } = req.user;

  // * save to card
  const result = await Card.create({ name, content, projectId, userId: id });

  // * publish event
  publisher({
    queueName: "newCard",
    id: result.id,
    name,
    content,
    projectId,
    userId: id,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
});

// * @route GET /api/v1/projects/:id/cards
// @desc    get card by projectId
// @access  Private
exports.getCardProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let { status, startCursor, endCursor } = req.query;

  // * check valid projectId
  const project = await Project.findOne({
    where: { id },
    attibutes: ["title"],
  });
  if (!project) {
    return next(new ErrorResponse("invalid preojectId", 400));
  }

  let filter = { projectId: id };
  if (status) {
    status = JSON.parse(status.toLowerCase());
    filter.status = status;
  }

  // * Main Query
  let queryObj = {
    where: filter,
    limit: req.query.limit,
    after: endCursor,
    order: [["id", "DESC"]],
    include: [{ model: User, attributes: ["username", "email"] }],
  };
  if (startCursor) {
    _.omit(queryObj, "after");
    _.extend(queryObj, { before: startCursor });
  }

  let data = await Card.paginate(queryObj);
  const dataArr = data.edges;

  // * Formating Data
  let fmtData = _.map(dataArr, (obj) => {
    const finalData = _.extend(obj.node, { cursor: obj.cursor });
    return finalData;
  });

  res.status(200).json({
    success: true,
    totalData: data.totalCount,
    limitPerPage: req.query.limit,
    nextPage: data.pageInfo.hasNextPage,
    previousPage: data.pageInfo.hasPreviousPage,
    startCursor: data.pageInfo.startCursor,
    endCursor: data.pageInfo.endCursor,
    project: project.title,
    data: fmtData || [],
  });

  // * publish event
  // let project = {
  //   projectId: result.id,
  //   projectName: title,
  // };
  // await createProject(project);
});

// * @route GET /api/v1/projects/cards/:id
// @desc    get card by id
// @access  Private
exports.getCard = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await Card.findOne({
    where: { id },
    include: [
      {
        model: User,
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      },
      { model: Project, attributes: ["title", "description"] },
    ],
  });
  res.status(200).json({
    success: true,
    data: data || {},
  });
});

// * @route PUT /api/v1/projects/cards/:id
// @desc    get card by id
// @access  Private
exports.updateCard = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, content, status } = req.body;

  // * check is creator project ?
  const isCreator = await Card.findOne({ where: { id, userId } });
  if (!isCreator) {
    return next(new ErrorResponse("forbidden", 400));
  }

  // * update
  await Card.update({ name, content, status }, { where: { id } });

  // * publish event
  publisher({
    queueName: "updateCard",
    id,
    name,
    content,
    status,
  });

  res.status(200).json({
    success: true,
    message: "succesfully update",
  });
});

// * @route DELETE /api/v1/projects/cards/:id
// @desc    delete card
// @access  Private
exports.deleteCard = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  // * check is creator project ?
  const isCreator = await Card.findOne({ where: { id, userId } });
  if (!isCreator) {
    return next(new ErrorResponse("forbidden", 400));
  }

  // * delete project
  await Card.destroy({ where: { id } });

  // * publish event
  publisher({
    queueName: "deleteCard",
    id,
  });

  res.status(200).json({
    success: true,
    message: "successfully delete",
  });
});
