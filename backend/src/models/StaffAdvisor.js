/*
Model Name:  StaffAdvisor
Usage: To store details regarding the semester's and batch's handled by each staff advisor, this enables the staff advisor to set the time table and courses for the batch she handles.
Author: Rishin R
*/
//name changed
const mongoose = require('mongoose');

const StaffAdvisorSchema = new mongoose.Schema({
  // _id represents the faculty ktu id
  _id: {
    type: String,
    required: true,
  },
  semesterHandled: {
    type: Number,
    required: true,
  },
  batchHandled: {
    type: Number,
    required: true,
  },
});

module.exports = new mongoose.model('StaffAdvisor', StaffAdvisorSchema);
