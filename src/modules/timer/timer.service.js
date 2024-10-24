const timerModel = require("../../models/timer");
const pager = require("../../utils/pager");

async function findOneById(_id) {
  return await timerModel.findById(_id).exec();
}

async function save(timer) {
  let _timer = new timerModel(timer);
  return await _timer.save();
}

async function paginated(params) {
  let perPage = params.perPage ? params.perPage : 10, page = Math.max(0, params.page);
  let filter = params.filter ? params.filter : {};
  let sort = params.sort ? params.sort : {};

  let count = await timerModel.countDocuments(filter);
  let data = await timerModel.find(filter)
    .limit(perPage)
    .skip(perPage * page)
    .sort(sort)
    .populate('task')
    .populate('user')
    .exec();

  return pager.createPager(page, data, count, perPage);
}

async function update(id, updatedTimer) {
  return await timerModel.findByIdAndUpdate(id, updatedTimer, { new: true }).exec();
}

async function remove(id) {
  return await timerModel.findOneAndDelete({ _id: id }).exec();
}

module.exports = { findOneById, save, paginated, update, remove };
