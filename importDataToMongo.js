const mongoose = require('mongoose');
const chalk = require('chalk');

const mongodbConfig = require('./config/mongoDB.config');

const accountModel = require('./app/model/account.model')
const bucketModel = require('./app/model/bucket.model')
const ibfModel = require('./app/model/ibf.model')
const metricModel = require('./app/model/metric.model')
const projectModel = require('./app/model/project.model')
const projectperformanceModel = require('./app/model/projectperformance.model')
const sbuModel = require('./app/model/sbu.model')
const userModel = require('./app/model/user.model')


mongoose.Promise = global.Promise;
mongoose.connect(mongodbConfig.configs.uri,{ useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('%s ... app connected to MONGO DB ...', chalk.green('✓'));
});
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

let CustomerBucketIdVar = ''
let PeopleBucketIdVar = ''

/**
 *
 * add Jatin in Users table
 */
newUser()

/**
 *
 * add Engineering in Buckets table
 */
newBucket('Engineering',function (id) {})
newBucket('Governance / Commercial',function (id) {})
newBucket('Compliance',function (id) {})
newBucket('Customer',function (CustomerBucketId) {
    CustomerBucketIdVar = CustomerBucketId
})
newBucket('People',function (PeopleBucketId) {
    PeopleBucketIdVar = PeopleBucketId
})

/**
 *
 * add IBG1 in IBFs table
 */
newIBF('IBG1','',function (IBG1Id) {
    newSBU('EMEA',IBG1Id,function (EMEA_SBUId) {
        newAccount('Account1',EMEA_SBUId,function (Account1Id) {
            newProject('Project1',Account1Id,function (Project1_id) {
                newMetric("PSAT","Score",CustomerBucketIdVar,"<","3.8",">=,<","3.8,4.30",	">=","4.3", function (Metric1_id) {
                    newProjectPerformance(Project1_id,Metric1_id,'10')
                    newProjectPerformance(Project1_id,Metric1_id,'20')
                })
            })
            newProject('Project2',Account1Id,function (Project2_id) {
                newMetric("CAPS (% Customers with CAPS score >=7)","%",CustomerBucketIdVar,"<=","80","<,>","93,80",	">=","93",function (Metric2_id) {
                    newProjectPerformance(Project2_id,Metric2_id,'30')
                    newProjectPerformance(Project2_id,Metric2_id,'40')
                })
            })
        })
    })
})
newIBF('IBG2','',function (IBG2Id) {
    newSBU('ROW',IBG2Id,function (ROW_SBUId) {
        newAccount('Account2',ROW_SBUId,function (Account2Id) {
            newProject('Project3',Account2Id,function (Project3_id) {
                newMetric("No. of Open Customer Escalations & penalty","Count",CustomerBucketIdVar,">","1","=","1",	"=","0",function (Metric3_id) {
                    newProjectPerformance(Project3_id,Metric3_id,'50')
                    newProjectPerformance(Project3_id,Metric3_id,'60')
                })
            })
            newProject('Project4',Account2Id,function (Project4_id) {
                newMetric("Attrition %","%",PeopleBucketIdVar,"<","70",">=,<","70,80",	">=","80",function (Metric4_id) {
                    newProjectPerformance(Project4_id,Metric4_id,'70')
                    newProjectPerformance(Project4_id,Metric4_id,'80')
                })
            })
        })
    })
})



/**
 *
 * add new User
 *
 */
function newUser(){
    let newUser = new userModel({
        Username: 'Jatin',
        Email: 'jatin@gmail.com',
        LastName: 'Prajapati',
        FirstName: 'Jatin',
        Password: '123',
        IsActive: true
    });
    newUser.save(function (err, newDoc) {
            if (err) {
                console.log('%s Can not new User to add!', chalk.red('✗'))
                throw err
            } else {
                console.log('%s New User added: %s', chalk.green('✓'),'Jatin')
            }
        })
}

/**
 *
 * add new IBF
 * param: IBG,Description
 * callBack: id of new IBF
 */
function newIBF(IBG,Description, callBack) {
    let newIBF = new ibfModel({
        IBFName: IBG,
        Description: Description,
    });
    newIBF.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new IBF to add!', chalk.red('✗'))
            throw err
        } else {
            callBack(newDoc._id)
            console.log('%s New IBF added: %s', chalk.green('✓'),IBG)
        }
    })
}

/**
 *
 * add new SBU
 * param: SBUName,IBFId
 * callBack: id of new SBU
 */
function newSBU(SBUName,IBFId, callBack) {
    let newSBU = new sbuModel({
        SBUName: SBUName,
        IBFId: IBFId,
    });
    newSBU.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new SBU to add!', chalk.red('✗'))
            throw err
        } else {
            callBack(newDoc._id)
            console.log('%s New SBU added: %s', chalk.green('✓'),SBUName)
        }
    })
}

/**
 *
 * add new Account
 * param: AccountName,SBUId
 * callBack: id of new Account
 */
function newAccount(AccountName,SBUId, callBack) {
    let newAccount = new accountModel({
        AccountName: AccountName,
        SBUId: SBUId,
    });
    newAccount.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new Account to add!', chalk.red('✗'))
            throw err
        } else {
            callBack(newDoc._id)
            console.log('%s New Account added: %s', chalk.green('✓'),AccountName)
        }
    })
}

/**
 *
 * add new Project
 * param: ProjectName,AccountId
 * callBack: id of new Project
 */
function newProject(ProjectName,AccountId, callBack) {
    let newProject = new projectModel({
        ProjectName: ProjectName,
        AccountId: AccountId,
    });
    newProject.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new Project to add!', chalk.red('✗'))
            throw err
        } else {
            callBack(newDoc._id)
            console.log('%s New Project added: %s', chalk.green('✓'),ProjectName)
        }
    })
}

/**
 *
 * add new Bucket
 * param: BucketName
 * callBack: id of new Bucket
 */
function newBucket(BucketName, callBack) {
    let id = ''
    let newBucketModel = new bucketModel({
        BucketName: BucketName
    });
    newBucketModel.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new Bucket to add!', chalk.red('✗'))
            throw err
        } else {
            console.log('%s New Bucket added: %s', chalk.green('✓'),BucketName)
            callBack(newDoc._id)

        }
    })
    // callBackFun(id)
}

/**
 *
 * add new Metric
 * param: MetricName, UoM, BucketId, RedCriteriaSign, RedCriteriaValue, AmberCriteriaSign, AmberCriteriaValue, GreenCriteriaSign, GreenCriteriaValue
 * callBack: id of new Metric
 */
function newMetric(MetricName, UoM, BucketId, RedCriteriaSign, RedCriteriaValue, AmberCriteriaSign, AmberCriteriaValue, GreenCriteriaSign, GreenCriteriaValue, callBack) {
    let newMetric = new metricModel({
        MetricName:MetricName,
        UoM:UoM,
        BucketId:BucketId,
        RedCriteriaSign:RedCriteriaSign,
        RedCriteriaValue:RedCriteriaValue,
        AmberCriteriaSign:AmberCriteriaSign,
        AmberCriteriaValue:AmberCriteriaValue,
        GreenCriteriaSign:GreenCriteriaSign,
        GreenCriteriaValue:GreenCriteriaValue
    });
    newMetric.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new Metric to add!', chalk.red('✗'))
            throw err
        } else {
            callBack(newDoc._id)
            console.log('%s New Metric added: %s', chalk.green('✓'),MetricName)
        }
    })
}

/**
 *
 * add new ProjectPerformance
 * param: ProjectId, MetricId, PerformanceValue
 *
 */
function newProjectPerformance(ProjectId, MetricId, PerformanceValue) {
    let newProjectPerformance = new projectperformanceModel({
        ProjectId:ProjectId,
        MetricId:MetricId,
        PerformanceValue:PerformanceValue
    });
    newProjectPerformance.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new ProjectPerformance to add!', chalk.red('✗'))
            throw err
        } else {
            console.log('%s New ProjectPerformance added: %s', chalk.green('✓'),PerformanceValue)
        }
    })
}
