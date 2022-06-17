require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const _ = require("underscore");
const Project = require("../models").project;
const paginate = require("../util/paginate");
const { create, findOne } = require("../service/project");
const log = require("log4js").getLogger("project");
log.level = "info";

// * @route GET /api/v1/projects
// @desc    get all projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  let filter = {};

  if (search) {
    let searchOption = { name: { [Op.like]: `%${search}%` } };
    filter = _.extend(searchOption, filter);
  }
  const data = await Project.findAndCountAll({
    where: filter,
    offset: req.skip,
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["updatedAt", "deletedAt"] },
  });

  const pagin = await paginate({
    length: data.count,
    limit: req.query.limit,
    page: req.query.page,
    req,
  });

  res.status(200).json({
    success: true,
    totalData: data.count,
    totalPage: pagin.totalPage,
    currentPage: pagin.currentPage,
    nextPage: pagin.nextPage,
    data: data.rows || [],
  });
});

// * @route POST /api/v1/projects
// @desc    create new project
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  let { title, description } = req.body;
  const creatorId = req.user.id;

  // * save to project
  const result = await Project.create(title, description, creatorId);

  // * save user_project (pivot table)

  // * send to publisher
  // let project = {
  //   projectId: result.id,
  //   projectName: title,
  // };
  // await createProject(project);

  res.status(201).json({
    success: true,
    data: result.data,
  });
});

// * @route GET /api/v1/projects/:id
// @desc    get detail project
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const data = await prisma.project.findUnique({ where: { id: parseInt(id) } });
  const result = await Project.findOne({ where: { id: parseInt(id) } });
  res.status(200).json({
    success: true,
    data: result.data || {},
  });
});

// * @route PUT /api/v1/projects/:id
// @desc    update project
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let { title, desc, memberIds } = req.body;
  const creatorId = Math.ceil(Math.random() * 1000);
  let fmtmMemberIds = memberIds.concat(",", creatorId);

  const project = await Project.findUnique({
    where: { id: parseInt(id) },
  });
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "project not found" });
  }
  await Project.update({
    where: { id: parseInt(id) },
    data: {
      title,
      desc,
      memberIds: fmtmMemberIds,
    },
  });
  res.status(200).json({
    success: true,
    message: "update success",
  });
});

// * @route DELETE /api/v1/projects/:id
// @desc    delete project
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findUnique({
    where: { id: parseInt(id) },
  });
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "project not found" });
  }
  await Project.delete({ where: { id: parseInt(id) } });
  res.status(200).json({
    success: true,
    message: "delete success",
  });
});
