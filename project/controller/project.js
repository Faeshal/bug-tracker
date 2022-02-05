require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const log = require("log4js").getLogger("avatar");
log.level = "info";
const createProject = require("../publisher/createProject");

// * @route POST /api/v1/projects
// @desc    post dummy
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // * prepare body
  let project = {
    id: Math.ceil(Math.random() * 10),
    projectName: Math.random().toString(36).substring(3, 9),
    createdAt: new Date().getTime(),
  };

  // * send to publisher
  await createProject(project);

  res.status(201).json({
    success: true,
    data: project,
  });
});
