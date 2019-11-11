const accountModel = require('./../model/account.model')
const bucketModel = require('./../model/bucket.model')
const ibfModel = require('./../model/ibf.model')
const metricModel = require('./../model/metric.model')
const projectModel = require('./../model/project.model')
const projectperformanceModel = require('./../model/projectperformance.model')
const sbuModel = require('./../model/sbu.model')


module.exports.updateProjectPerformance = function (req, res) {
    projectperformanceModel.findById(req.body.performanceId, function(err, Performance) {
        if (err)
            res.send(err);
        Performance.ProjectId = req.body.projectId;
        Performance.MetricId = req.body.metricId;
        Performance.PerformanceValue = req.body.performanceValue;
        Performance.save(function(err, pr) {
            if (err)
                res.send(err);

            res.json({status: true, message: 'Project Performance updated.', ProjectPerformance: pr});
        });

    });
};

module.exports.getProjectMetricPerformance = function (req, res) {
    let ProjectMetricPerformance = []
    projectModel.findById(req.body.projectId).exec(function (err, project) {
        accountModel.findById(project.AccountId).exec(function (err, account) {
            sbuModel.findById(account.SBUId).exec(function (err, SBU) {
                ibfModel.findById(SBU.IBFId).exec(function (err, ibf) {
                    projectperformanceModel.find({ProjectId:project._id}, function (err, Performances) {
                        for (let j=0 ;j< Performances.length;j++) {
                            metricModel.findById(Performances[j].MetricId).exec(function (err, metric) {
                                bucketModel.findById(metric.BucketId).exec(function (err, bucket) {
                                    ProjectMetricPerformance.push({
                                        IBFName:ibf.IBFName,
                                        SBUName:SBU.SBUName,
                                        AccountId:account._id,
                                        AccountName:account.AccountName,
                                        ProjectId:project._id,
                                        ProjectName:project.ProjectName,
                                        FTE:ibf.IBFName,
                                        BucketId:bucket._id,
                                        BucketName:bucket.BucketName,
                                        MatricId:metric._id,
                                        MatricName:metric.MetricName,
                                        UOM:metric.UoM,
                                        PerformanceValue:Performances[j].PerformanceValue,
                                        RAG: 0
                                    })
                                    if(ProjectMetricPerformance.length === Performances.length ){
                                        res.json({status: true, msg: "Project Metric Performance send.", ProjectMetricPerformance: ProjectMetricPerformance});
                                    }else{

                                    }
                                })
                            })
                        }
                    })

                })
            })
        })
    })
};

module.exports.getProjectByAccount = function (req, res) {
    let dataProjects=[]
    accountModel.findById(req.body.accountId).exec(function (err, account) {
        projectModel.find({AccountId:req.body.accountId}, function (err, projects) {
            if (err) {
                res.json({status: false, msg: err});
                throw err
            } else if (projects) {
                for (let i=0 ;i< projects.length;i++) {
                    dataProjects.push({
                        AccountId:account._id,
                        AccountName:account.AccountName,
                        ProjectId:projects[i]._id,
                        ProjectName:projects[i].ProjectName
                    })
                }
                if(dataProjects.length===projects.length){
                    res.json({status: true, msg: "projects send.", projects: dataProjects});
                }else{

                }
            } else {
                res.json({status: false, msg: "project not exist"});
            }
        })
    })

};
