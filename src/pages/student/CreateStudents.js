import React, { useEffect, useState } from "react"

import { Row, Col, Card, CardBody, CardTitle, Button, } from "reactstrap"

import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import Select from "react-select"

//Import Action to copy breadcrumb items from local state to redux state
import { fetchQuestionPaper, setBreadcrumbItems } from "../../store/actions";
import { addSchool } from "store/school/action";
import { useSelector } from "react-redux";
import schoolesReducer from '../../store/school/reducer';
import axios from "axios";
import { toast } from "react-toastify";
import { ExamCenters, SchoolTypes, fetchSchoolTypes } from "helpers/school_helper";
import { uploadStudents } from "helpers/student_helper";
import { getAllMainExamPapers } from "helpers/center_helper";
import Loader from "components/Loader/Loader";
import { STUDENT_CSV_FILE_FORMAT } from "helpers/url_helper";


const CreateStudents = (props) => {
    document.title = "Question Bank | Create Students";
    const [file, setFile] = useState(null);
    const [questionPaper, setQuestionPaper] = useState(null);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [questionPapersData, setQuestionPapersData] = useState(null);
    const [allExams, setAllExams] = useState([]);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    // let questionPapers = useSelector(state => state.questionPapersReducer.questionPapers)


    const breadcrumbItems = [
        { title: "Students", link: "#" },
        { title: "Create Students", link: "#" },
    ]
    useEffect(() => {           /* For closing the sidebar if opened */
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])

    useEffect(() => {
        props.setBreadcrumbItems('Create Students', breadcrumbItems)
    })

    const fetchAllExams = async () => {
        console.log("Call hua")
        try {
            const result = await getAllMainExamPapers();
            if (result?.success) {
                console.log(result)
                setAllExams(result?.result);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllExams();
    }, []);
    useEffect(() => {
        console.log("allexams", allExams);
    }, [allExams]);





    const handleFileUpload = async (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);

    };

    const handleSelectQuestionPaper = selectedOption => {
        setQuestionPaper(selectedOption)
    }







    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !questionPaper) {
            setSpanDisplay("inline")

        }
        else {
            const formData = new FormData();
            formData.append('File', file);
            formData.append('PaperId', questionPaper.id)
            setLoader(true);
            const result = await uploadStudents(formData);
            console.log(result);
            if (result?.success) {
                setLoader(false);
                toast.success(result?.message);
                setFile(null);
                setQuestionPaper(null);
            }
            else {
                setLoader(false);
                toast.error(result?.message);
            }
        }
    };

    const handleDownloadFile = async () => {
        try {

            // Make a request to the API endpoint to download the ZIP file
            const response = await axios.get(STUDENT_CSV_FILE_FORMAT, {
                responseType: 'blob' // Set response type to 'blob' to receive binary data
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a URL for the blob data
            const url = window.URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;

            // Specify the filename for the downloaded file
            link.setAttribute('download', 'stuents_file_format.csv');

            // Append the link to the body
            document.body.appendChild(link);

            // Click the link to trigger the download
            link.click();

            // Clean up: remove the link and revoke the URL object
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while downloading demo file');
        }
    }
    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}
            <Row>
                <Col>
                    <Card>
                        <CardBody className="col-xl-6 col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <div className="d-flex justify-content-between mb-5">

                                <CardTitle className="h4">Upldoad Student File</CardTitle>
                                <button type="submit" onClick={handleDownloadFile} className="btn btn-info w-md">Download Demo Csv File</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Question Paper
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={questionPaper}
                                            onChange={handleSelectQuestionPaper}
                                            options={allExams}
                                            getOptionLabel={option => option.examName}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!questionPaper && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Upload File
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            type="file"
                                            accept='.xlsx'
                                            name='xlsxFile'
                                            id='xlsxFile'
                                            placeholder='Upload a File'
                                            className='form-control form-control-file'
                                            data-buttonname="btn-secondary"
                                            onChange={handleFileUpload} />
                                        {!file && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                    </div>
                                </Row>




                                <Row className="mb-3">
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary w-md">Submit</button>
                                    </div>
                                </Row>
                            </form>

                        </CardBody>
                    </Card>
                </Col>
            </Row>



        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(CreateStudents);