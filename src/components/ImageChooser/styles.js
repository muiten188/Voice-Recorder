export default {
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },

    image: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
    },
    imageItem: {
        width: 90,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 0,
        marginBottom: 0,
        padding: 5
    },
    close: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    closeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        position: 'absolute',
        backgroundColor: 'black',
        top: 0,
        right: 0,
        elevation: 3
    },

    iconDone: {
        color: 'white',
        fontSize: 16
    },
    imageSizeContainer: {
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    addImage: {
        marginTop: 10,
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'dotted'
    }
}
