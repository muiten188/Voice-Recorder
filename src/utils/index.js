import React from 'react'
import { Platform, PixelRatio, Dimensions, Text } from "react-native";
import moment from "moment";
import I18n from "~/src/I18n";
const { width, height } = Dimensions.get("window");
import APIManager from "~//src/store/api/APIManager";
import SHA256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";
import {
    PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
    MAX_USERNAME_LENGTH,
    MAX_LENGTH_NAME
} from "~/src/constants";

export const chainParse = (obj, attrArr) => {
    if (!obj || typeof obj != "object") {
        return null;
    }

    let cloneObj = Object.assign({}, obj);

    for (let i = 0; i < attrArr.length; i++) {
        cloneObj = cloneObj[attrArr[i]];
        if (typeof cloneObj == "undefined" || cloneObj == null) return null;
    }

    return cloneObj;
};

export const getFontStyle = (style = "regular") => {
    let iOSFontWeight = "400";
    let androidFontFamily = "sans-serif";
    switch (style) {
        case "thin": {
            iOSFontWeight = "100";
            androidFontFamily = "sans-serif-thin";
            break;
        }
        case "light": {
            iOSFontWeight = "300";
            androidFontFamily = "sans-serif-light";
            break;
        }

        case "medium": {
            iOSFontWeight = "600";
            androidFontFamily = "sans-serif-medium";
            break;
        }
        case "black": {
            iOSFontWeight = "900";
            androidFontFamily = "sans-serif-black";
            break;
        }
        case "bold": {
            return { fontWeight: "bold" };
        }

        case "regular":
        default: {
            iOSFontWeight = "400";
            androidFontFamily = "sans-serif";
            break;
        }
    }
    if (Platform.OS == "android") {
        return { fontFamily: androidFontFamily };
    }
    return { fontWeight: iOSFontWeight };
};

export const getElevation = number => {
    if (Platform.OS == "android") return { elevation: number };
    if (number == 0)
        return {
            shadowColor: "black",
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
                width: 0
            }
        };
    return {
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 1.5,
        shadowOffset: {
            height: number,
            width: 0
        }
    };
};

export const toElevation = number => {
    if (Platform.OS == "android") return { elevation: number };
    return {
        shadowColor: "black",
        shadowOpacity: number > 0 ? 0.22 : 0,
        shadowRadius: 3,
        shadowOffset: {
            height: number / 2,
            width: 0
        }
    };
};

export const getWidth = input => {
    const { width } = Dimensions.get("window");
    let pixelRatio = PixelRatio.get();
    // Design Dimension: width 750, pixelRatio 2
    // Assume device this case will have pixelRatio 2
    if (width * pixelRatio < 828) {
        return (width / 414) * input;
    }
    return input;
};

export const scaleWidth = input => {
    return (width / 414) * input;
};

export const scaleHeight = input => {
    return (height / 812) * input;
};

export const isValidEmail = str => {
    if (!str) return false;
    // ^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let result = emailRegex.test(str);

    if (result == true) {
        if (str[str.indexOf("@") + 1] == "-" || str[str.length - 1] == "-") {
            return false;
        }
    }

    return result;
};

export const isValidWebsite = str => {
    if (!str) return false
    // const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
    const websiteRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    return websiteRegex.test(str)
}

export const isValidPhoneNumer = str => {
    if (!str) return false;
    if (str.length < 9 || str.length > 13) return false;
    if (str[0] == 0 && str.length < 10) return false;
    const START_VALID_PHONE_NUMBER = I18n.t("START_VALID_PHONE_NUMBER");
    let validStart = [
        ...START_VALID_PHONE_NUMBER,
        ...START_VALID_PHONE_NUMBER.map(number => "0" + number),
        ...START_VALID_PHONE_NUMBER.map(number => "84" + number),
        ...START_VALID_PHONE_NUMBER.map(number => "\\+84" + number)
    ];

    let joinCondition = validStart.join("|");
    let phoneRegexStr = "^(" + joinCondition + ")\\d{7}$";
    let phoneRegex = new RegExp(phoneRegexStr);
    return phoneRegex.test(str);
};

const insertString = (string, index, stringInsert) => {
    return (
        string.slice(0, index) + stringInsert + string.slice(index, string.length)
    );
};

const insertSpace = (string, index) => {
    return insertString(string, index, " ");
};

const isValidPhoneNumerWithCountryCode = str => {
    if (!str) return false;
    if (str.length < 9 || str.length > 13) return false;
    if (str[0] == 0 && str.length < 10) return false;
    const START_VALID_PHONE_NUMBER = I18n.t("START_VALID_PHONE_NUMBER");
    let validStart = [
        ...START_VALID_PHONE_NUMBER.map(number => "84" + number),
        ...START_VALID_PHONE_NUMBER.map(number => "\\+84" + number)
    ];

    let joinCondition = validStart.join("|");
    let phoneRegexStr = "^(" + joinCondition + ")\\d{7}$";
    let phoneRegex = new RegExp(phoneRegexStr);
    return phoneRegex.test(str);
};

const isValidPhoneNumerWithoutZero = str => {
    if (!str) return false;
    if (str.length < 9 || str.length > 13) return false;
    if (str[0] == 0 && str.length < 10) return false;
    const START_VALID_PHONE_NUMBER = I18n.t("START_VALID_PHONE_NUMBER");
    let validStart = [...START_VALID_PHONE_NUMBER];
    let joinCondition = validStart.join("|");
    let phoneRegexStr = "^(" + joinCondition + ")\\d{7}$";
    let phoneRegex = new RegExp(phoneRegexStr);
    return phoneRegex.test(str);
};

export const formatPhoneNumber = phoneNumber => {
    if (!phoneNumber) return "";
    const isStartWithPlus = false; //phoneNumber.toString().startsWith('+')
    let newPhoneNumber = phoneNumber.toString().replace(/[^0-9]/g, "");
    if (
        newPhoneNumber.startsWith("84") &&
        isValidPhoneNumerWithCountryCode(newPhoneNumber)
    ) {
        newPhoneNumber = newPhoneNumber.replace("84", "0"); // replace only first occurred
    } else if (
        newPhoneNumber.startsWith("+84") &&
        isValidPhoneNumerWithCountryCode(newPhoneNumber)
    ) {
        newPhoneNumber = newPhoneNumber.replace("+84", "0"); // replace only first occurred
    } else if (
        !newPhoneNumber.startsWith("0") &&
        isValidPhoneNumerWithoutZero(newPhoneNumber)
    ) {
        newPhoneNumber = "0" + newPhoneNumber;
    }

    if (newPhoneNumber.length == 10) {
        newPhoneNumber = insertSpace(newPhoneNumber, 6);
        newPhoneNumber = insertSpace(newPhoneNumber, 3);
        return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber;
    } else if (newPhoneNumber.length == 11) {
        newPhoneNumber = insertSpace(newPhoneNumber, 7);
        newPhoneNumber = insertSpace(newPhoneNumber, 3);
        return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber;
    } else if (newPhoneNumber.length < 10 || newPhoneNumber.length > 11) {
        if (newPhoneNumber.length >= 10) {
            newPhoneNumber = insertSpace(newPhoneNumber, 9);
        }
        if (newPhoneNumber.length >= 7) {
            newPhoneNumber = insertSpace(newPhoneNumber, 6);
        }
        if (newPhoneNumber.length >= 4) {
            newPhoneNumber = insertSpace(newPhoneNumber, 3);
        }
        return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber;
    }

    return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber;
};

export const formatPhoneNumberWithoutAddZero = phoneNumber => {
    if (!phoneNumber) return "";
    const isStartWithPlus = false; //phoneNumber.toString().startsWith('+')
    let newPhoneNumber = phoneNumber.toString().replace(/[^0-9]/g, "");
    // if (newPhoneNumber.startsWith('84') && isValidPhoneNumerWithCountryCode(newPhoneNumber)) {
    //     newPhoneNumber = newPhoneNumber.replace('84', '0') // replace only first occurred
    // } else if (newPhoneNumber.startsWith('+84') && isValidPhoneNumerWithCountryCode(newPhoneNumber)) {
    //     newPhoneNumber = newPhoneNumber.replace('+84', '0') // replace only first occurred
    // } else if (!newPhoneNumber.startsWith('0') && isValidPhoneNumerWithoutZero(newPhoneNumber)) {
    //     newPhoneNumber = '0' + newPhoneNumber
    // }

    if (newPhoneNumber.length == 10) {
        newPhoneNumber = insertSpace(newPhoneNumber, 6);
        newPhoneNumber = insertSpace(newPhoneNumber, 3);
        return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber + "";
    } else if (newPhoneNumber.length == 11) {
        newPhoneNumber = insertSpace(newPhoneNumber, 7);
        newPhoneNumber = insertSpace(newPhoneNumber, 3);
        return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber + "";
    } else if (newPhoneNumber.length < 10 || newPhoneNumber.length > 11) {
        if (newPhoneNumber.length >= 10) {
            newPhoneNumber = insertSpace(newPhoneNumber, 9);
        }
        if (newPhoneNumber.length >= 7) {
            newPhoneNumber = insertSpace(newPhoneNumber, 6);
        }
        if (newPhoneNumber.length >= 4) {
            newPhoneNumber = insertSpace(newPhoneNumber, 3);
        }
        return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber + "";
    }
    return isStartWithPlus ? `+${newPhoneNumber}` : newPhoneNumber + "";
};
export const formatList = (debtList, keyDate) => {
    let listContent = [];
    if (debtList && debtList.length > 0) {
        let min = null;
        for (let i = 0; i < debtList.length; i++) {
            let date =
                moment(debtList[i][keyDate] * 1000).date() +
                "/" +
                (moment(debtList[i][keyDate] * 1000).month() + 1) +
                "/" +
                moment(debtList[i][keyDate] * 1000).year();
            if (date !== min) {
                min = date;
                let items = debtList.filter(item => {
                    return (
                        moment(item[keyDate] * 1000).date() +
                        "/" +
                        (moment(item[keyDate] * 1000).month() + 1) +
                        "/" +
                        moment(item[keyDate] * 1000).year() ===
                        min
                    );
                });
                let end = moment().endOf("day").unix();
                let start = moment().startOf("day").unix();
                let home = moment(debtList[i][keyDate] * 1000).unix()
                let check = start <= home && home <= end
                // let check = moment().startOf("day")<=moment(debtList[i].tradingDate*1000)<moment().endOf("day")
                listContent.push({
                    title: check ? "Hôm nay" : moment(debtList[i][keyDate] * 1000).format(I18n.t("date_format")),
                    data: items
                });
            }
        }
    }
    //   return list;
    return listContent;
};

export const toNormalCharacter = str => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
};
export const formatTenantCode = str => {
    const format = toNormalCharacter(str);
    for (let i = 0; i < format.length; i++) {
        if (format[i] === " ") {
            format[i] = "a";
        }
    }
    return format;
};

export const trimSpecialCharacter = str => {
    return str
        .split("")
        .filter(item =>
            /(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|Ì|Í|Ị|Ỉ|Ĩ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|Ỳ|Ý|Ỵ|Ỷ|Ỹ|Đ|\w|\s)/.test(
                item
            )
        )
        .join("");
};

export const trimSpecialCharacterIncludeSpace = str => {
    return str
        .split("")
        .filter(item =>
            /(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|Ì|Í|Ị|Ỉ|Ĩ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|Ỳ|Ý|Ỵ|Ỷ|Ỹ|Đ|[a-zA-Z0-9])/.test(
                item
            )
        )
        .join("");
};

export const isFunction = obj => {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

export const replacePatternString = (str, repStr, pattern = "*****") => {
    return str.replace(pattern, repStr);
};

export const maskBankAccount = bankAccountNumber => {
    if (!bankAccountNumber) return "";
    const last4Digit = bankAccountNumber.substr(bankAccountNumber.length - 4);
    return `\u2022 \u2022 \u2022 \u2022  \u2022 \u2022 \u2022 \u2022  \u2022 \u2022 \u2022 \u2022  ${last4Digit}`;
};

export const formatMoney = str => {
    if (str == null || typeof str == "undefined" || str.length === 0) return "";

    if (str.length == 2 && str[1] == 0 && str[0] == 0) {
        return "0";
    }

    var temp = str;

    for (let i = 0; i < temp.length; i++) {
        if (temp[i] != "0") {
            temp = temp.substr(i);
            if (temp.length > 1 && temp[0] == ",") {
                temp = temp.substr(1);
            }
            return temp
                .toString()
                .replace(/\D/g, "")
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            // console.log("temp ==", temp.toString().replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1\."))

            break;
        }
    }

    return str
        .toString()
        .replace(/\D/g, "")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const revertFormatMoney = str => {
    if (!str || str.length === 0) return "";
    return str.toString().replace(/\,/g, "");
};

export const getDrawableImageUri = (fileName, ext = "png") =>
    Platform.OS == "android" ? fileName : `./asset/${fileName}.${ext}`;

export const shouldDisablePress = (key, time = 500) => {
    if (this[key] === true) return true;
    this[key] = true;
    setTimeout(() => {
        this[key] = false;
    }, time);
    return false;
};

export const convertFileUri = uri => uri.replace("file:///", "");

export const getImageIDFromUrl = url => {
    const splitUrl = url.split("/").filter(item => !!item);
    if (!splitUrl || splitUrl.length == 0) return "";
    return splitUrl[splitUrl.length - 1];
};

const getDisplayWithZero = number => {
    if (number < 0) return number;
    if (number <= 9) return `0${number}`;
    return number;
};

export const getImageUrl = url => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("https")) return url;
    const imageUploadUrl = APIManager.apiInstance
        ? APIManager.apiInstance.IMAGE_UPLOAD_URL
        : "";
    return `${imageUploadUrl}/image/${url}`;
};

export const getDataFromBankUserQRCode = qrData => {
    const dataSplit = qrData.split("|").filter(item => !!item);
    if (!dataSplit || dataSplit.length == 0 || !dataSplit[3]) {
        return false;
    }
    return {
        name: dataSplit[0],
        phone: dataSplit[1],
        accountNumber: dataSplit[3]
    };
};

export const isTablet = () => {
    const smallestWidth = Math.min(width, height);
    return smallestWidth >= 500;
};

export const getIntSQL = value => {
    if (!value) return 0;
    return parseInt(value);
};

export const getStringSQL = value => {
    if (!value) return `""`;
    return `"${value.replace(/\"/g, "")}"`;
};

export const isValidPassword = password => {
    if (!password) return;
    let passwordRegex = new RegExp("^[A-Za-z0-9]*$");

    if (passwordRegex.test(password) === false) {
        return false;
    }
    if (MIN_USERNAME_LENGTH != password.length) {
        return false;
    }
    // if (password.length < PASSWORD_LENGTH) {
    //   return false;
    // }
    return true;
    //   return !!(password.length == PASSWORD_LENGTH);
};
export const isValidUserName = userName => {
    if (!userName) return false;
    let userNameRegex = new RegExp("^[A-Za-z0-9]*$");

    if (userNameRegex.test(userName) === false) {
        return false;
    }
    if (MIN_USERNAME_LENGTH > userName.length) {
        return false;
    }
    if (userName.length > MAX_USERNAME_LENGTH) {
        return false;
    }
    return true;
};

export const sha256 = str => {
    return SHA256(str).toString(CryptoJS.enc.Hex);
};

export const utf8ArrayToStr = array => {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(
                    ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
                );
                break;
        }
    }

    return out;
};

export const formatSpaces = (str, length, align = "left") => {
    const strInput = str.toString();
    if (strInput.length <= length) {
        const numExtraSpace = length - strInput.length;
        let extraSpaceStr = "";
        for (let i = 0; i < numExtraSpace; i++) {
            extraSpaceStr += " ";
        }
        return align == "left" ? str + extraSpaceStr : extraSpaceStr + str;
    } else {
        return strInput.substr(0, strInput.length - 4) + "...";
    }
};

export const isValidName = name => {
    if (!name) return;
    const regexName = new RegExp(
        "^[a-zA-Z0-9 ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{1,255}"
    );
    if (regexName.test(name) === false) {
        return false;
    }
    if (name.length > MAX_LENGTH_NAME) {
        return false;
    }
    return true;
};

export const isValidTenantCode = tenantCode => {
    if (!tenantCode) return;
    let tenantCodeRegex = new RegExp("^[A-Za-z0-9]*$");

    if (tenantCodeRegex.test(tenantCode) === false) {
        return false;
    }
    if (MIN_USERNAME_LENGTH > tenantCode.length) {
        return false;
    }
    if (tenantCode.length > MAX_USERNAME_LENGTH) {
        return false;
    }
    return true;
};

export const isValidPassWord = password => {
    if (!password) return;
    let userNameRegex = new RegExp("^[A-Za-z0-9]*$");

    if (userNameRegex.test(password) === false) {
        return false;
    }
    if (MIN_USERNAME_LENGTH != password.length) {
        return false;
    }
    // if (userName.length > MAX_USERNAME_LENGTH) {
    //   return false;
    // }
    return true;
    // return !!(MIN_USERNAME_LENGTH >= userName.length && userName >= MAX_USERNAME_LENGTH);
    console.log("minh");
};

export const getShortenString = (str, length) => {
    const strInput = str.toString();
    if (strInput.length <= length) return strInput;
    return strInput.substr(0, length) + "...";
};

export const isLocalImage = uri => {
    if (!uri) return false;
    return uri.startsWith("file://") || uri.startsWith("content://");
};


export const generateHighlightText = (text, normalStyle, highLightStyle) => {
    const splitArr = text.split("\"")
    return (
        <Text style={normalStyle} >
            {splitArr.map((item, index) => index % 2 == 0 ? item : <Text style={highLightStyle} key={item}> "{item}"</Text>)}
        </Text>
    )
}
export const generateHighlightTextItem = (text, normalStyle, highLightStyle) => {
    const splitArr = text.split("\"")
    return (
        <Text style={normalStyle} numberOfLines={1} >
            {splitArr.map((item, index) => index % 2 == 0 ? item : <Text style={highLightStyle} key={item}>"{item}"</Text>)}
        </Text>
    )
}

export const getTableDisplayName = (tableIdArr, floorTable) => {
    if (!tableIdArr || tableIdArr.length == 0 || !floorTable || floorTable.length == 0) return ''
    const tableArr = []
    floorTable.forEach(floor => {
        floor.listTable.forEach(table => {
            if (tableIdArr.find(it => it == table.id)) {
                tableArr.push(`${chainParse(floor, ['floor', 'floorName'])}-${table.tableName}`)
            }
        })
    })
    return tableArr.join(',')
}

const _formatTwoDigitNumber = (number) => {
    if (+number < 10) return `0${number}`
    return '' + number
}

export const getRecordTimeString = (recordTime) => {
    const recordHours = Math.floor(recordTime / 3600)
    const recordMinues = Math.floor((recordTime - 3600 * recordHours) / 60)
    const recordSeconds = recordTime - 3600 * recordHours - 60 * recordMinues
    return `${_formatTwoDigitNumber(recordHours)} : ${_formatTwoDigitNumber(recordMinues)} : ${_formatTwoDigitNumber(recordSeconds)}`
}

export const getPlayerTimeString = (totalTime) => {
    const recordMinues = Math.floor(totalTime / 60)
    const recordSeconds = Math.floor(totalTime - 60 * recordMinues)
    return `${_formatTwoDigitNumber(recordMinues)} : ${_formatTwoDigitNumber(recordSeconds)}`
}

export const getUploadKey = (originKey, localFile) => {
    const lastDotIndexLocalFile = localFile.lastIndexOf(".")
    if (!lastDotIndexLocalFile) return ''
    const localFileExtension = localFile.substr(lastDotIndexLocalFile + 1)
    const lastDotOriginKey = originKey.lastIndexOf(".")
    const originKeyWithoutExtension = originKey.substring(0, lastDotOriginKey)
    return originKeyWithoutExtension + '.' + localFileExtension
}

export const getFileName = (filePath) => {
    if (!filePath) return ''
    const lastSlashIndex = filePath.lastIndexOf("/")
    if (!lastSlashIndex) return ''
    return filePath.substr(lastSlashIndex + 1)
}