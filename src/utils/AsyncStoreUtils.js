// import { AsyncStorage } from "react-native-community/async-storage";
import AsyncStorage from '@react-native-community/async-storage'

// import { Component } from "react";
export const saveTenantCode = async tenantCode =>{
    try {
        await AsyncStorage.setItem("tenantCode", tenantCode);
        console.log("SET ITEM SUCCESSFUL" + tenantCode);
      } catch (error) {
        console.log("SET ITEM FAIL");
      }
}
export const saveUserName = async userName =>{
    try {
        await AsyncStorage.setItem("userName",userName);
        console.log("SET ITEM SUCCESSFUL" + userName);
      } catch (error) {
        console.log("SET ITEM FAIL");
      }
}