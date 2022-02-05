require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const log = require("log4js").getLogger("project");
log.level = "info";
const createProject = require("../publisher/createProject");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// * @route POST /api/v1/projects
// @desc    post dummy
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  const { title, desc } = req.body;
  const creatorId = Math.ceil(Math.random() * 1000);

  // * save to database
  const result = await prisma.project.create({
    data: { title, desc, creatorId },
  });

  // * send to publisher
  let project = {
    projectId: result.id,
    projectName: title,
  };
  await createProject(project);

  res.status(201).json({
    success: true,
    data: result,
  });
});

// * @route GET /api/v1/projects/:id
// @desc    get deatil project
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await prisma.project.findUnique({ where: { id: parseInt(id) } });
  res.status(200).json({
    success: true,
    data: data || {},
  });
});
