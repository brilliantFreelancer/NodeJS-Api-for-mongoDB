const metricModel = require('./../model/metric.model')
const bucketModel = require('./../model/bucket.model')

module.exports.GetMetricConfiguration = function (req, res) {
    metricModel.find({}, function (err, metrics) {
        if (err) {
            res.json({status: false , msg: err});
            throw err
        }
        else if (metrics) {
            let metricsWithBucketName =[]
            for(let i=0 ;i< metrics.length;i++){
                bucketModel.findById(metrics[i].BucketId).exec(function (err, bucket) {
                    metricsWithBucketName.push({
                        "BucketId":metrics[i].BucketId,
                        "BucketName":bucket.BucketName,
                        "MatricId":metrics[i]._id,
                        "MatricName":metrics[i].MetricName,
                        "UoM":metrics[i].UoM,
                        "RedCriteriaSign":metrics[i].RedCriteriaSign,
                        "RedCriteriaValue":metrics[i].RedCriteriaValue,
                        "AmberCriteriaSign":metrics[i].AmberCriteriaSign,
                        "AmberCriteriaValue":metrics[i].AmberCriteriaValue,
                        "GreenCriteriaSign":metrics[i].GreenCriteriaSign,
                        "GreenCriteriaValue":metrics[i].GreenCriteriaValue
                    })
                    if(metricsWithBucketName.length===metrics.length){
                        res.json({status: true, msg: "metrics send.", metrics: metricsWithBucketName});
                    }else{

                    }
                })
            }

        } else {
            res.json({status: false, msg: "metric not exist"});
        }
    });
};
