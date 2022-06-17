require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const User = require("../models").user;
const Card = require("../models").card;
const _ = require("underscore");
const { ErrorResponse } = require("../middleware/errorHandler");
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
  // let project = {
  //   projectId: result.id,
  //   projectName: title,
  // };
  // await createProject(project);

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
    data: fmtData || [],
  });

  // * publish event
  // let project = {
  //   projectId: result.id,
  //   projectName: title,
  // };
  // await createProject(project);
});
