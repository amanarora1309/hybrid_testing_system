import React, { useEffect, useState } from "react"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle, Button, } from "reactstrap"

import { connect } from "react-redux";
import Select from "react-select"

//Import Action to copy breadcrumb items from local state to redux state
import { deleteLanguage, fetchClass, fetchLanguage, setBreadcrumbItems, setSuccessFalseLanguage, updateLanguage } from "../../store/actions";

import "../Tables/datatables.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";

const AllLanguages = (props) => {
    document.title = "Question Bank | All Languages";
    const [modalShow, setModalShow] = useState(false);
    const [languageName, setLanguageName] = useState("");
    const [languageDescription, setLanguageDescription] = useState("");
    const [languageCode, setLanguageCode] = useState("");
    const [id, setId] = useState({});
    const [classs, setClasss] = useState(null);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const dispatch = useDispatch();
    const result = useSelector(state => state.languagesReducer)
    const classes = useSelector(state => state.classesReducer)


    const breadcrumbItems = [
        { title: "Language", link: "#" },
        { title: "All Difficulties", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('All Difficulties', breadcrumbItems)
    })


    useEffect(() => {
        if (classes?.classes.length == 0) {
            dispatch(fetchClass());
        }
        if (result?.languages.length == 0) {
            dispatch(fetchLanguage());
        }

    })


    // const data = {
    //     columns: [
    //         {
    //             label: "Code",
    //             field: "languageCode",
    //             sort: "asc",
    //             width: 100,
    //         },
    //         {
    //             label: "Name",
    //             field: "languageName",
    //             sort: "asc",
    //             width: 150,
    //         },
    //         {
    //             label: "Description",
    //             field: "languageDescription",
    //             sort: "asc",
    //             width: 200,
    //         },
    //     ],
    //     rows: result?.languages?.result,
    //     rows: result?.languages?.result?.map(row => ({
    //         ...row,
    //         clickEvent: () => handleRowClick(row)
    //     }))
    // }
    const data = {
        columns: [
            {
                label: "Serial No.",
                field: "serialNo",
                sort: "asc",
                width: 50,
            },
            {
                label: "Name",
                field: "languageName",
                sort: "asc",
                width: 50,
            }
        ],
        rows: result?.languages?.result?.map((row, index) => ({
            ...row,
            serialNo: index + 1, // Add 1 to start counting from 1
            clickEvent: () => handleRowClick(row),
        })),
    };


    const handleRowClick = (row) => {

        setModalShow(true);

        setId(row.id);
        setLanguageName(row.languageName);
    }

    const handleUpdate = () => {
        if (!languageName) {
            setSpanDisplay("inline")

        }
        else {
            dispatch(updateLanguage({ id, languageName }))
        }
    }
    useEffect(() => {
        if (result.success == true) {
            setModalShow(false);
            dispatch(setSuccessFalseLanguage());
        }
    }, [result.success]);
    const handleDelete = () => {
        setModalShow(false);
        setDeleteModalShow(false)
        dispatch(deleteLanguage(id));
    }

    return (
        <React.Fragment>

            <Row >
                <Col className="col-12">
                    <Card>
                        <div className="col-6">

                            <CardBody>
                                <CardTitle className="h4">All Difficulties </CardTitle>
                                <MDBDataTable responsive bordered data={data} noBottomColumns />
                            </CardBody>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Language
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Language
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter new Language"
                                maxLength="50"
                                value={languageName}
                                onChange={(e) => setLanguageName(e.target.value)} />
                            {!languageName && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleUpdate} className="waves-effect waves-light">Update</Button>{" "}
                    <Button type="button" color="danger" onClick={() => { setDeleteModalShow(true); setModalShow(false) }} className="waves-effect waves-light">Delete</Button>{" "}
                </Modal.Footer>
            </Modal>
            <Modal
                show={deleteModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>

                    <h4>
                        Are you sure want to remove this difficult.
                    </h4>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => { setDeleteModalShow(false); setModalShow(true) }} className="waves-effect waves-light">No</Button>{" "}
                    <Button type="button" color="danger" onClick={handleDelete} className="waves-effect waves-light">Yes</Button>{" "}

                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(AllLanguages);