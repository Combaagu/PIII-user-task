const taskModel = require("../../models/task");
const pager = require("../../utils/pager");

// buscar
async function findOneById(_id) {
  return await taskModel.findById(_id).exec();
}

// guardar
async function save(task) {
  let _task = new taskModel(task);
  return await _task.save();
}

// paginado
async function paginated(params) {
  let perPage = params.perPage ? params.perPage : 10, page = Math.max(0, params.page);
  let filter = params.filter ? params.filter : {};
  let sort = params.sort ? params.sort : {};

  let count = await taskModel.countDocuments(filter);
  let data = await taskModel.find(filter)
    .limit(perPage)
    .skip(perPage * page)
    .sort(sort)
    .populate('user')
    .exec();

  return pager.createPager(page, data, count, perPage);
}

// actualizar
async function update(id, updatedTask) {
  return await taskModel.findByIdAndUpdate(id, updatedTask, { new: true }).exec();
}

// eliminar
async function remove(id) {
  return await taskModel.findOneAndDelete({ _id: id }).exec();
}

module.exports = { findOneById, save, paginated, update, remove };
