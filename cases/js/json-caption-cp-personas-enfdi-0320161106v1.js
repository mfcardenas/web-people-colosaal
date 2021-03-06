/**
 * Created by mcardenas on 16/10/16.
 */

/**
 *
 * @returns {{_id: string, cam-1: {_id: string, records: string, total: string, rows: *[]}, cam-2: {_id: string, records: string, total: string, rows: *[]}, cam-3: {_id: string, records: string, total: string, rows: *[]}, cam-4: {_id: string, records: string, total: string, rows: *[]}}}
 */
function getDefaultComments(){
    var def_comment = {
        "_id": "CAMASSISTANT-CP000003",
        "cam-1": {
            "_id": "CP000003-CAM1-VI01_20161015",
            "records": "1",
            "total": "1",
            "rows": [
                {
                    "endTime": 4000,
                    "startTime": 1000,
                    "position": "HB",
                    "data": "This is an example of a comment.",
                    "alignment": "C",
                    "time": 1,
                    "text": "Example comment for video camera 1",
                    "overlayText": "",
                    "class": "blue-marker-class",
                    "comment": "This is an example of an extensive commentary.",
                    "format": [
                        "i"
                    ],
                    "id": 1,
                    "key": "18ff9ba6-3c24-441a-8120-64953787695d"
                }
            ]
        },
        "cam-2": {
            "_id": "CP000003-CAM2-VI02_20161015",
            "records": "1",
            "total": "1",
            "rows": [
                {
                    "endTime": 4000,
                    "startTime": 1500,
                    "position": "HB",
                    "data": "This is an example of a comment.",
                    "alignment": "C",
                    "time": 1.5,
                    "text": "Example comment for video camera 2.",
                    "overlayText": "Tag 2",
                    "class": "blue-marker-class",
                    "comment": "This is an example of an extensive commentary.",
                    "format": [
                        "i"
                    ],
                    "id": 1,
                    "key": "791f267b-85d7-463d-8db6-f1dedb23ae9a"
                }
            ]
        },
        "cam-3": {
            "_id": "CP000003-CAM3-VI03_20161015",
            "records": "1",
            "total": "1",
            "rows": [
                {
                    "endTime": 4000,
                    "startTime": 2000,
                    "position": "HB",
                    "data": "This is an example of a comment.",
                    "alignment": "C",
                    "time": 2,
                    "text": "Example comment for video camera 3.",
                    "overlayText": "Tag 3",
                    "class": "blue-marker-class",
                    "comment": "This is an example of an extensive commentary.",
                    "format": [
                        "i"
                    ],
                    "id": 1,
                    "key": "81e77d8d-aa0b-4a34-aab0-b1684e884b77"
                }
            ]
        },
        "cam-4": {
            "_id": "CP000003-CAM4-VI04_20161015",
            "records": "1",
            "total": "1",
            "rows": [
                {
                    "endTime": 4000,
                    "startTime": 2500,
                    "position": "HB",
                    "data": "This is an example of a comment.",
                    "alignment": "C",
                    "time": 2.5,
                    "text": "Example comment for video camera 4.",
                    "overlayText": "Tag 4",
                    "class": "blue-marker-class",
                    "comment": "This is an example of an extensive commentary.",
                    "format": [
                        "i"
                    ],
                    "id": 1,
                    "key": "dc980b5e-e1f8-4d79-a4a3-c60056e69a38"
                }
            ]
        }
    }

    return def_comment;
}
