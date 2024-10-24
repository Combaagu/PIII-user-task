const User = require('../../models/user'); // Asegúrate de tener el modelo de usuario correcto

const userService = {
  async paginated({ page, perPage, filter, sort }) {
    const users = await User.find(filter)
      .sort(sort)
      .skip(page * perPage)
      .limit(perPage);
    const total = await User.countDocuments(filter);
    return { total, users };
  },

  async findOneById(id) {
    return await User.findById(id);
  },

  async findOne(filter) {
    return await User.findOne(filter);
  },

  async save(userData) {
    const user = new User(userData);
    return await user.save();
  },

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  },

  async remove(id) {
    return await User.findByIdAndDelete(id);
  },
};

module.exports = userService;