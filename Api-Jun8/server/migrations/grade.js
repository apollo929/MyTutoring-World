module.exports = async () => DB.Grade.find({})
  .remove()
  .then(() => DB.Grade.create(
    {
      name: 'Kindergarten',
      alias: 'kindergarten',
      desciption: 'this is kindergarten',
      ordering: 0,
      type: 'elementary'
    },
    {
      name: 'Grade 1',
      alias: 'grade-1',
      desciption: 'this is grade 1',
      ordering: 1,
      type: 'elementary'
    },
    {
      name: 'Grade 2',
      alias: 'grade-2',
      desciption: 'this is grade 2',
      ordering: 2,
      type: 'elementary'
    },
    {
      name: 'Grade 3',
      alias: 'grade-3',
      desciption: 'this is grade 3',
      ordering: 3,
      type: 'elementary'
    },
    {
      name: 'Grade 4',
      alias: 'grade-4',
      desciption: 'this is grade 4',
      ordering: 4,
      type: 'elementary'
    },
    {
      name: 'Grade 5',
      alias: 'grade-5',
      desciption: 'this is grade 5',
      ordering: 5,
      type: 'elementary'
    },
    {
      name: 'Grade 6',
      alias: 'grade-6',
      desciption: 'this is grade 6',
      ordering: 6,
      type: 'middle-school'
    },
    {
      name: 'Grade 7',
      alias: 'grade-7',
      desciption: 'this is grade 7',
      ordering: 7,
      type: 'middle-school'
    },
    {
      name: 'Grade 8',
      alias: 'grade-8',
      desciption: 'this is grade 8',
      ordering: 8,
      type: 'middle-school'
    },
    {
      name: 'Grade 9',
      alias: 'grade-9',
      desciption: 'this is grade 9',
      ordering: 9,
      type: 'high-school'
    },
    {
      name: 'Grade 10',
      alias: 'grade-10',
      desciption: 'this is grade 10',
      ordering: 10,
      type: 'high-school'
    },
    {
      name: 'Grade 11',
      alias: 'grade-11',
      desciption: 'this is grade 11',
      ordering: 11,
      type: 'high-school'
    },
    {
      name: 'Grade 12',
      alias: 'grade-12',
      desciption: 'this is grade 12',
      ordering: 12,
      type: 'high-school'
    },
    {
      name: 'Freshman',
      alias: 'freshman',
      desciption: 'this is freshman',
      ordering: 13,
      type: 'college'
    },
    {
      name: 'Sophomore',
      alias: 'sophomore',
      desciption: 'this is sophomore',
      ordering: 14,
      type: 'college'
    },
    {
      name: 'Junior',
      alias: 'junior',
      desciption: 'this is junior',
      ordering: 15,
      type: 'college'
    },
    {
      name: 'Senior',
      alias: 'senior',
      desciption: 'this is senior',
      ordering: 16,
      type: 'college'
    },
  ));