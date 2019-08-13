import SQLite from 'react-native-sqlite-storage'
export default class DBManager {
    static dbInstance = null;
    static getInstance = async () => {
        // SQLite.enablePromise(true)
        if (DBManager.dbInstance == null) {
            return new Promise((resolve, reject) => {
                DBManager.dbInstance = SQLite.openDatabase({ name: "mshop", location: 'default' }, () => {
                    console.log('Open DB Success')
                    resolve(DBManager.dbInstance)
                }, (err) => {
                    console.log('Open DB Error', err)
                    reject(err)
                })
            })
        }
        return Promise.resolve(DBManager.dbInstance)
    }
}