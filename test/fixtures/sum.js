
var levelup = require('levelup')
var rimraf  = require('rimraf')

if(!module.parent) {

  var dir = '/tmp/map-reduce-sum-test'

  rimraf(dir, function () {

    levelup(dir, {createIfMissing: true}, function (err, db) {

    var l = 10e3, i = 1
    var stream = db.writeStream()
      while(l--)
        stream.write({key: JSON.stringify(i++), value: JSON.stringify(i)})
    })

  })

}

module.exports = sum

function sum(db, callback) {
    rimraf(db, function (err) {
        if (err) {
            return callback(err)
        }

        levelup(db, { createIfMissing: true }, function (err, db) {
            if (err) {
                return callback(err)
            }

            var stream = db.writeStream()

            for(var i = 0; i < 1000; i++) {
                stream.write({
                    key: JSON.stringify(i)
                    , value: JSON.stringify(i)
                })
            }

            stream.end()

            stream.on("close", function () {
                callback(null)
            })
        })
    })
}

