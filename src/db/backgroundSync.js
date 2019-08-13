import DBManager from '~/src/db/DBManager'
import { getIntSQL, getStringSQL } from '~/src/utils'

const getVersion = () => {
    const versionQuery = 'SELECT DISCOUNT as discount, PRODUCT as product, `TABLE` as `table`, MENU as menu FROM data_version';
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.executeSql(versionQuery, [], (result) => {
                    resolve(result.rows.raw()[0])
                }, (err) => {
                    reject(err)
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

const saveVersion = (productVersion, menuVersion, tableVersion, discountVersion) => {
    const deleteVersionQuery = 'DELETE FROM data_version'
    const saveVersionQuery = 'INSERT INTO data_version(PRODUCT, MENU, `TABLE`, DISCOUNT) VALUES (?, ?, ?, ?)'

    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.executeSql(deleteVersionQuery, [], (deleteVersionResult) => {
                    // console.log('deleteVersionResult', deleteVersionResult)
                    db.executeSql(saveVersionQuery, [productVersion, menuVersion, tableVersion, discountVersion], (saveVersionResult => {
                        // console.log('saveVersionResult', saveVersionResult)
                        resolve([deleteVersionResult, saveVersionResult])
                    }))
                }, (deleteVersionErr) => {
                    reject(deleteVersionErr)
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

const clearVersion = () => {
    const deleteVersionQuery = 'DELETE FROM data_version'
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.executeSql(deleteVersionQuery, [], (deleteVersionResult) => {
                    resolve([deleteVersionResult])
                }, (deleteVersionErr) => {
                    reject(deleteVersionErr)
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

export default {
    getVersion,
    saveVersion,
    clearVersion
}