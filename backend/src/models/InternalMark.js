/*
Model Name: InternalMark
Usage: This model is used to store the internal marks of the theory papers, this includes internal exams, assignments, and attendance. All the above discussed factors can be added or removed as required. Daily attendance can be updated and this can then be used to find the attendance percentage and the corresponding marks for it. coMapping is performed for each internal exam this data can be used to map the qns against the co marks obtained by each student, which can then be used to find the co attainment of the entire class.
Author: Harikrishnan V
*/
//Internal marks of only theory subjects . practical marks have to be completed
const mongoose = require('mongoose');

const InternalMarkSchema = new mongoose.Schema({
  //_id represents the studentId
  _id: {
    type: String,
    required: true,
  },
  courseAssessmentTheory: [
    {
      courseCode: {
        type: String,
        required: true,
      },
      internalExams: [
        {
          nameOfExam: {
            type: String,
            required: false,
          },
          dateOfExam: {
            type: Date,
            required: false,
          },
          marksScored: {
            type: Number,
            required: false,
          },
          maxMarks: {
            type: Number,
            required: false,
          },
          coMapping: [
            {
              coNo: {
                type: String,
                required: false,
              },
              qns: [
                {
                  qno: {
                    type: Number,
                    required: false,
                  },
                  marksScored: {
                    type: Number,
                    required: false,
                  },
                  maxMarks: {
                    type: Number,
                    required: false,
                  },
                },
              ],
            },
          ],
        },
      ],
      internalExamMarks: {
        type: Number,
        required: false,
      },
      assignments: [
        {
          nameOfAssignment: {
            type: String,
            required: false,
          },
          marksScored: {
            type: Number,
            required: false,
          },
          maxMarks: {
            type: Number,
            required: false,
          },
        },
      ],
      assignmentExamMarks: {
        type: Number,
        required: false,
      },
      attendance: [
        {
          date: {
            type: Date,
            required: false,
          },
          hour: {
            type: Number,
            required: false,
          },
          isPresent: {
            type: Boolean,
            required: false,
          },
        },
      ],
      attendancePercentage: {
        type: Number,
        required: false,
      },
      attendanceMarks: {
        type: Number,
        required: false,
      },
      totalInternalMarks: {
        type: Number,
        required: false,
      },
    },
  ],
});

module.exports = new mongoose.model('InternalMark', InternalMarkSchema);
/*
db.internalmarks.update(
  { _id: "tve20cs003" },
  {
    $push: {
      courseAssessmentTheory: {
        courseCode: "HUT300",
        attendance: [
          {
            date: ISODate("2023-04-17T00:00:00.000+00:00"),
            hour: 5,
            isPresent: true,
            _id:ObjectId(),
          },
          {
            date: ISODate("2023-03-19T00:00:00.000+00:00"),
            hour: 6,
            isPresent: true,
            _id:ObjectId(),
          },
          {
            date: ISODate("2023-04-19T00:00:00.000+00:00"),
            hour: 4,
            isPresent: true,
            _id:ObjectId(),
          }
        ]
      }
    }
  }
)
*/
