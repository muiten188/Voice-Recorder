export default sql = [
    'DROP TABLE IF EXISTS "db_version";',
    'DROP TABLE IF EXISTS "s_order";',
    'DROP TABLE IF EXISTS "s_order_detail";',
    'DROP TABLE IF EXISTS "s_order_sync";',
    'DROP TABLE IF EXISTS "s_product";',
    'DROP TABLE IF EXISTS "product_sync";',
    'DROP TABLE IF EXISTS "m_merchant_table";',
    'DROP TABLE IF EXISTS "m_merchant_floor";',
    'DROP TABLE IF EXISTS "m_merchant_menu";',
    'DROP TABLE IF EXISTS "s_product_menu_mapping";',
    'DROP TABLE IF EXISTS "s_product_media";',
    'DROP TABLE IF EXISTS "data_version";',
    'DROP TABLE IF EXISTS "local_notification";',
    `CREATE TABLE "db_version" (
        "version"	INTEGER DEFAULT 1
    );`,
    `CREATE TABLE "s_order" (
        "ID"	VARCHAR(50),
        "MB_USER_ID"	VARCHAR(50),
        "MERCHANT_ID"	VARCHAR(50),
        "PAYMENT_METHOD"	NUMERIC,
        "TYPE"	NUMERIC,
        "TOTAL_AMOUNT"	NUMERIC,
        "DISCOUNT_AMOUNT"	NUMERIC,
        "PAID_AMOUNT"	NUMERIC,
        "STATUS"	NUMERIC,
        "ORDER_CODE"	VARCHAR(50),
        "CREATED_AT"	NUMERIC,
        "LAST_MODIFIED_AT"	NUMERIC,
        "CREATED_BY"	NUMERIC,
        "LAST_MODIFIED_BY"	NUMERIC,
        "RECEIVER_NAME"	VARCHAR(100),
        "RECEIVER_PHONE"	VARCHAR(20),
        "RECEIVER_PROVINCE"	VARCHAR(100),
        "RECEIVER_DISTRICT"	VARCHAR(100),
        "RECEIVER_WARD"	VARCHAR(100),
        "RECEIVER_ADDRESS"	VARCHAR(200),
        "VOUCHER_CODE"	VARCHAR(20),
        "RECEIVER_NOTE"	VARCHAR(200),
        "BUYER_COMPANY_NAME"	VARCHAR(100),
        "BUYER_TAX_CODE"	VARCHAR(50),
        "BUYER_COMPANY_ADDRESS"	VARCHAR(200),
        "SHIPPING_FEE"	NUMERIC DEFAULT 0,
        "MERCHANT_BANK_ACCOUNT_NAME"	VARCHAR(100),
        "MERCHANT_BANK_ACCOUNT"	VARCHAR(50),
        "REF_PAYMENT_CODE"	VARCHAR(50),
        "NOTE"	VARCHAR(1000),
        "TABLE_ID"	VARCHAR(50),
        "TABLE_DISPLAY_NAME"	VARCHAR(250),
        "CLIENT_ORDER_ID"	VARCHAR(50),
        "IS_SYNC"	INTEGER,
        "IS_DELETED"	INTEGER,
        "TABLE_ID_LIST"	TEXT,
        "CREATOR_NAME"	TEXT,
        "SURCHARGE"	NUMERIC,
        PRIMARY KEY("ID")
    )`,
    `CREATE TABLE IF NOT EXISTS "s_order_detail" (
            "ID" VARCHAR(50) PRIMARY KEY,
            "ORDER_ID" VARCHAR(50),
            "PRODUCT_ID" VARCHAR(50),
            "PRICE" NUMERIC,
            "QTY" NUMERIC,
            "PRODUCT_VARIANT_ID" VARCHAR(50)
            );`,
    `CREATE TABLE "s_order_sync" (
        "PAGE"	INTEGER,
        "TOTAL_PAGE"	INTEGER,
        "TOTAL_ELEMENT"	INTEGER,
        "LAST_SYNC"	INTEGER,
        "TAB_ID"	INTEGER,
        "PAGE_SIZE"	INTEGER
    );`,
    `CREATE TABLE "s_product" (
        "ID"	VARCHAR(50),
        "SKU"	VARCHAR(50),
        "BAR_CODE"	VARCHAR(50),
        "NAME"	VARCHAR(255),
        "CATEGORY"	NUMERIC,
        "MERCHANT_ID"	VARCHAR(50),
        "BRAND_ID"	NUMERIC,
        "ORIGINAL_PRICE"	NUMERIC,
        "PRICE"	NUMERIC,
        "UNIT"	NUMERIC,
        "QUANTITY"	NUMERIC,
        "DESCRIPTION"	VARCHAR(4000),
        "TAG"	VARCHAR(1000),
        "RATE"	NUMERIC,
        "NUM_RATE"	NUMERIC,
        "STATUS"	NUMERIC,
        "CREATED_AT"	NUMERIC,
        "LAST_MODIFIED_AT"	NUMERIC,
        "CREATED_BY"	VARCHAR(50),
        "LAST_MODIFIED_BY"	VARCHAR(50),
        "HAS_VARIANT"	NUMERIC,
        "PACKAGE_WEIGHT"	FLOAT(126),
        "PACKAGE_LENGTH"	NUMERIC,
        "PACKAGE_WIDTH"	NUMERIC,
        "PACKAGE_HEIGHT"	NUMERIC,
        "DISCOUNT_ID"	VARCHAR(50),
        "AVATAR"	VARCHAR(100),
        "SEARCHABLE"	NUMERIC DEFAULT 0,
        "SHOW_ALL"	NUMERIC DEFAULT 1,
        "SAME_PRICE"	VARCHAR(20) DEFAULT 1,
        "CHECK_STORE"	VARCHAR(20) DEFAULT 0,
        "PROMOTION_PRICE"	NUMERIC,
        "PROMOTION_TITLE"	TEXT,
        "PRODUCT_CODE"	VARCHAR(50),
        "NAME_WITHOUT_ACCENT"	VARCHAR(255),
        PRIMARY KEY("ID")
    );`,

    `CREATE TABLE "product_sync" (
        "PAGE_NUMBER" INTEGER,
        "PAGE_SIZE" INTEGER,
        "TOTAL_PAGES" INTEGER,
        "TOTAL_ELEMENTS" INTEGER
        );`,
    ` CREATE TABLE IF NOT EXISTS "m_merchant_table" (
        "ID" VARCHAR(50) PRIMARY KEY,
        "TABLE_NAME" VARCHAR(100),
        "FLOOR_ID" VARCHAR(50),
        "MERCHANT_ID" VARCHAR(50),
        "ORDINAL" NUMERIC,
        "NUM_OF_GUEST" NUMERIC DEFAULT 0,
        "BUSY" NUMERIC DEFAULT 0,
        "ENTRY_TIME" NUMERIC DEFAULT 0,
        "IS_SYNC"	INTEGER
        );`,

    `CREATE TABLE IF NOT EXISTS "m_merchant_floor" (
        "ID" VARCHAR(50) PRIMARY KEY,
        "FLOOR_NAME" VARCHAR(10),
        "MERCHANT_ID" VARCHAR(50),
        "ORDINAL" NUMERIC
        );`,

    ` CREATE TABLE IF NOT EXISTS "m_merchant_menu" (
        "ID" VARCHAR(50) PRIMARY KEY,
        "NAME" VARCHAR(500),
        "MERCHANT_ID" VARCHAR(50),
        "ORDINAL" NUMERIC DEFAULT 0
        );`,
    `CREATE TABLE "s_product_menu_mapping" (
        "ID"	INTEGER PRIMARY KEY AUTOINCREMENT,
        "MERCHANT_ID"	VARCHAR(50),
        "MENU_ID"	VARCHAR(50),
        "PRODUCT_ID"	VARCHAR(50),
        "ORDINAL"	INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS "s_product_media" (
    "ID" VARCHAR(50) PRIMARY KEY,
    "PRODUCT_ID" VARCHAR(50),
    "UPLOAD_IMAGE_ID" VARCHAR(50),
    "URL" VARCHAR(100),
    "THUMBNAIL_URL" VARCHAR(100),
    "TYPE" NUMERIC,
    "ORDINAL" NUMERIC,
    "PRODUCT_VARIANT_ID" VARCHAR(50)
    );`,

    ` CREATE TABLE IF NOT EXISTS "s_product_sync" (
    "PAGE" INTEGER,
    "TOTAL_PAGE" INTEGER,
    "TOTAL_ELEMENT" INTEGER,
    "LAST_SYNC" INTEGER,
    "PAGE_SIZE" INTEGER
    );`,

    `CREATE TABLE "data_version" (
        "PRODUCT" INTEGER,
        "MENU" INTEGER,
        "DISCOUNT" INTEGER,
        "TABLE" INTEGER
        );`,

    `CREATE TABLE "local_notification" (
    "ID"	TEXT,
    "TYPE"	INTEGER,
    "SUB_ID"	TEXT,
    PRIMARY KEY("ID")
);`,
]