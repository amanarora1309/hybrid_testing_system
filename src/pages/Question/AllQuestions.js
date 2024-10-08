import React, { useEffect, useState } from "react"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle, Button, } from "reactstrap"

import { connect } from "react-redux";
import Select from "react-select"

//Import Action to copy breadcrumb items from local state to redux state
import { deleteQuestion, fetchClass, fetchCourse, fetchDifficulty, fetchLanguage, fetchQuestion, fetchSection, fetchSubSection, setBreadcrumbItems, setSuccessFalseQuestion, updateQuestion } from "../../store/actions";

import "../Tables/datatables.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { fetchSingleQuestion } from "helpers/question_helper";
import { BACKEND_SPRING, IMAGE_FETCH } from "helpers/url_helper";
import DOMPurify from 'dompurify';
import { useWindowSize } from 'react-use';
import Loader from "components/Loader/Loader";
const AllQuestions = (props) => {
    document.title = "Question Bank | All Questions";
    const [modalShow, setModalShow] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [id, setId] = useState({});
    const [classs, setClasss] = useState(null);
    const [type, setType] = useState('short');
    const [difficulty, setDifficulty] = useState(null);
    const [language, setLanguage] = useState(null);
    const [answer, setAnswer] = useState("");
    const [course, setCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [section, setSection] = useState(null);
    const [sections, setSections] = useState([]);
    const [subSection, setSubSection] = useState(null);
    const [subSections, setSubSections] = useState([]);
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [editOptionText, setEditOptionText] = useState("Edit Options");
    const [optionsEditDisplay, setOptionsEditDisplay] = useState("none");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [loader, setLoader] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const dispatch = useDispatch();
    const questions = useSelector(state => state.questionsReducer);
    const classes = useSelector(state => state.classesReducer);
    // const courses = useSelector(state => state.coursesReducer);
    // const sections = useSelector(state => state.sectionsReducer);
    // const subSections = useSelector(state => state.subSectionsReducer);
    const difficultys = useSelector(state => state.difficultysReducer)
    const languages = useSelector(state => state.languagesReducer);
    const { width } = useWindowSize();

    const breadcrumbItems = [
        { title: "Question", link: "#" },
        { title: "All Questions", link: "#" },
    ]

    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])

    useEffect(() => {
        const paginationSection = document.querySelector(".dataTables_paginate");
        const MBDTableDiv = document.querySelector("#MBDTableDiv");
        if (width <= 480) {
            paginationSection.style.width = "290px"
            MBDTableDiv.style.overflowX = "auto";
        } else {
            paginationSection.style.width = ""
            MBDTableDiv.style.overflowX = "";
        }
    }, [width]);

    useEffect(() => {
        props.setBreadcrumbItems('All Questions', breadcrumbItems)
    })


    useEffect(() => {
        if (classes?.classes?.length == 0) {
            dispatch(fetchClass());
        }
        if (questions?.questions?.length == 0) {
            dispatch(fetchQuestion());
        }
        if (difficultys?.difficultys?.length == 0) {
            dispatch(fetchDifficulty());
        }
        if (languages?.languages?.length == 0) {
            dispatch(fetchLanguage());
        }

    }, [])

    const fetchCourses = async () => {
        if (classs) {
            let id = classs.id;

            let result = await fetchAllCoursesByClass(id);
            setCourses(result);
            // courses = result;
        }
    }
    useEffect(() => {
        fetchCourses();
    }, [classs]);

    const fetchSections = async () => {
        if (course) {
            let id = course.id;

            let result = await fetchAllSectionsByCourse([id]);
            setSections(result);
            // sections = result;
        }
    }
    useEffect(() => {
        fetchSections();
    }, [course]);

    const fetchSubSections = async () => {
        if (section) {
            let id = section.id;

            let result = await fetchAllSubSectionsBySection([id]);
            setSubSections(result);
            // subSection = result;
        }
    }
    useEffect(() => {
        fetchSubSections();
    }, [section]);


    const fetchImageFile = async () => {

        const tempDiv = rteObj.getContent();
        const objectElements = tempDiv.querySelectorAll('.e-rte-image');

        if (objectElements.length > 0) {
            try {
                const filesPromises = Array.from(objectElements).map(async (objectElement) => {
                    const imageUrl = objectElement.getAttribute('src');
                    const name = objectElement.getAttribute('alt') || 'unnamed';

                    const response = await fetch(imageUrl);
                    const blob = await response.blob();

                    return new File([blob], `image_${name}.png`, { type: 'image/png' });
                });

                return await Promise.all(filesPromises);
            } catch (error) {
                console.error('Error fetching images:', error);
                return [];
            }
        } else {
            console.log('No img element found within .e-rte-image');
            return [];
        }
    };

    const sanitizeAndRenderHTML = (htmlString) => {
        const sanitizedHTML = DOMPurify.sanitize(htmlString);
        return { __html: sanitizedHTML };
    };
    const extractTextContent = (htmlString) => {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    };


    const data = {
        columns: [
            {
                label: "Serial No.",
                field: "serialNo",
                sort: "asc",
                width: 50,
            },
            {
                label: "Type",
                field: "type",
                sort: "asc",
                width: 100,
            },
            {
                label: "Question",
                field: "contentText",
                sort: "asc",
                width: 150,
            },
            {
                label: "Answer",
                field: "answer",
                sort: "asc",
                width: 200,
            },
        ],
        rows: questions?.questions?.result?.map((row, index) => ({
            ...row,
            serialNo: index + 1, // Add 1 to start counting from 1
            clickEvent: () => handleRowClick(row)
        }))
    };

    // Modify the data for the "Question" field if bulkCreated is 0
    data?.rows?.forEach(row => {
        if (row.bulkCreated === 0) {
            row.description = row.contentText; // Assign contentText to description if bulkCreated is 0
        }
    });


    const [test, setTest] = useState([]);
    const handleRowClick = async (row) => {

        setId(row.id);
        let result = await fetchSingleQuestion(row?.id);
        setDescription(result?.result[0]?.description);
        setAnswer(result?.result[0]?.answer)
        setType(result?.result[0]?.type);


        setCourse(result?.result[0]?.course);
        setSection(result?.result[0]?.section);
        setSubSection(result?.result[0]?.subSection);
        setDifficulty(result?.result[0]?.difficulty);
        setLanguage(result?.result[0]?.language);

        let imagesHTML;
        if (BACKEND_SPRING) {
            setClasss(result?.result[0]?.classs);
            if (result?.result[0].type == "mcq") {
                let arr = [];
                result?.result[0]?.optionResult?.map((d) => {

                    arr.push(d.optionName);
                })
                console.log(arr)
                setTest(arr);
                setOptions(arr);

            }
            imagesHTML = result?.result[0].imageResult?.map(url =>
                `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
                // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
            ).join('');
        }
        else {
            setClasss(result?.result[0]?.class);


            if (result?.result[0]?.type == "mcq") {
                let arr = [];
                result?.optionResult?.map((d) => {
                    arr.push(d.optionName);
                })
                setOptions(arr);
            }
            imagesHTML = result?.imageResult?.map(url =>
                `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
                // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
            ).join('');
        }
        setOldImages(imagesHTML);
        setModalShow(true);
    }



    function removeSpecificDivs(htmlString) {
        // Parse the HTML string into a new DOM document
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Selectors for the divs to remove based on class and id
        const selectorsToRemove = [
            'div.e-rte-content#defaultRTErte-view',
            'div.e-content.e-lib.e-keyboard#defaultRTE_rte-edit-view'
        ];

        // Iterate over selectors and remove the matching elements
        selectorsToRemove.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(element => {
                // Instead of removing the element, we replace it with its content
                while (element.firstChild) {
                    element.parentNode.insertBefore(element.firstChild, element);
                }
                element.parentNode.removeChild(element);
            });
        });

        // Serialize the updated DOM back to a string
        // Inner HTML of the body will contain the expected output
        return doc.body.innerHTML;
    }


    const removeImgTag = (htmlContent) => {
        // Create a temporary element to parse the HTML string
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;

        // Find all image elements
        const imageElements = tempElement.querySelectorAll('img');

        // Remove each image element
        imageElements.forEach(imageElement => {
            imageElement.parentNode.removeChild(imageElement);
        });

        // Return the modified HTML
        return tempElement.innerHTML;
    };


    const handleUpdate = async () => {
        // const rteValue = rteObj.getText();
        // Get the HTML content from rteObj.getContent()
        const res = rteObj.getContent();
        let desc = res.outerHTML;

        // Remove the specified div and update the HTML content
        desc = removeSpecificDivs(desc);

        let tempElement = document.createElement('div');
        tempElement.innerHTML = res.outerHTML;
        let textContent = tempElement.textContent || tempElement.innerText;
        if (!classs || !course || !section || !subSection || !desc || !difficulty || !language || !type || !answer) {
            setSpanDisplay("inline")

        }
        else {

            const fetchedImageFiles = await fetchImageFile();
            const formData = new FormData();
            fetchedImageFiles.forEach((image) => {
                formData.append('Image', image);
            });
            options?.forEach((option) => {
                formData.append("Options", option);
            });
            formData.append('Id', id);
            formData.append('ClassId', classs.id);
            formData.append('Class', JSON.stringify(classs))
            formData.append('CourseId', course.id);
            formData.append('Course', JSON.stringify(course));
            formData.append('SectionId', section.id);
            formData.append('Section', JSON.stringify(section));
            formData.append('SubSectionId', subSection.id);
            formData.append('SubSection', JSON.stringify(subSection));
            formData.append('Description', removeImgTag(desc));
            formData.append('ContentText', textContent);
            formData.append('DifficultyId', difficulty.id);
            formData.append('languageId', language.id);
            formData.append('Difficulty', JSON.stringify(difficulty));
            formData.append('Type', type);
            formData.append('Answer', answer);

            setLoader(true);
            dispatch(updateQuestion(formData));
            dispatch(fetchQuestion());
            console.log(questions)
        }
    }
    useEffect(() => {
        if (questions.success == true) {
            setModalShow(false);
            setDeleteModalShow(false);
            dispatch(setSuccessFalseQuestion());
        }
        setLoader(false);
    }, [questions.success]);

    const handleDelete = () => {

        setLoader(true);
        dispatch(deleteQuestion(id));
    }

    const handleSelectClass = selectedOption => {
        setClasss(selectedOption);
        setCourses([]);
        setSections([]);
        setCourse(null);
        setSection(null);
    };

    const handleSelectCourse = selectedOption => {
        setCourse(selectedOption);
        setSections([]);
        // sections = [];
        setSubSections([]);
        // subSections = [];
        setSection(null);
        setSubSection(null);
    };

    const handleSelectSection = selectedOption => {
        setSection(selectedOption);
        setSubSections([]);
        setSubSection(null);
    };
    const handleSelectSubSection = selectedOption => {
        setSubSection(selectedOption);
    };
    const handleSelectDifficulty = selectedOption => {
        setDifficulty(selectedOption);
    };
    const handleSelectLanguage = selectedOption => {
        setLanguage(selectedOption);
    };
    const handleTypeChange = (event) => {
        setType(event.target.value);
        setAnswer("");
    };
    const addOption = () => {
        console.log(options)
        setOptions([...options, option]);
        setOption("");
    }
    const handleSetOptionsClick = () => {
        if (optionsEditDisplay == "none") {
            setOptionsEditDisplay("inline-block");
            setEditOptionText("Done");
        }
        else {
            setOptionsEditDisplay("none");
            setEditOptionText("Edit Options");
        }
    }
    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };




    // ***** code for rich text editor textarea ****************


    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', '|',
            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
            'SourceCode', '|', 'Undo', 'Redo']
    };
    const quickToolbarSettings = {
        image: ['Replace', 'Align', 'Caption', 'Remove', 'InsertLink', 'OpenImageLink', '-', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'],
        link: ['Open', 'Edit', 'UnLink']
    };

    let rteObj;
    // set the value to Rich Text Editor
    // let template = `<div style="display:block;"><p style="margin-right:10px">${description} ${oldImages}</p></div>`;
    let template = description + oldImages;
    // let template = description;


    // Rich Text Editor items list
    let items = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
        'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', '|', 'Undo', 'Redo'
    ];
    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}
            <Row>
                <Col className="col-12">
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <CardTitle className="h4">All Questions </CardTitle>
                                <div className="">

                                    <h5>Total Questions: 3000</h5>
                                    <h5>Balance Questions: 500</h5>
                                    <div className="d-flex justify-content-end">
                                        <Button type="button" color="info" className="waves-effect waves-light">Top Up</Button>{" "}
                                    </div>
                                </div>
                            </div>
                            <div id="MBDTableDiv" >
                                <MDBDataTable className="table-row-hover" responsive bordered data={data} style={{ cursor: 'pointer' }} noBottomColumns />

                            </div>
                        </CardBody>
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
                        Edit Question
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="" style={{ height: "80vh", overflowY: "scroll", overflowX: "visible" }}>
                        <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Class Name
                            </label>
                            <div className="col-md-10">
                                <Select

                                    value={classs}
                                    onChange={handleSelectClass}
                                    options={classes?.classes?.result}
                                    getOptionLabel={option => option.className + " (" + option.classCode + ")"}
                                    getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                    classNamePrefix="select2-selection"
                                />
                                {!classs && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>

                        </Row>

                        {courses && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Course Name
                            </label>
                            <div className="col-md-10">
                                <Select

                                    value={course}
                                    onChange={handleSelectCourse}
                                    options={courses?.result}
                                    getOptionLabel={option => option.courseName + " (" + option.courseCode + ")"}
                                    getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                    classNamePrefix="select2-selection"
                                />
                                {!course && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                            </div>

                        </Row>}

                        {sections && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Section Name
                            </label>
                            <div className="col-md-10">
                                <Select

                                    value={section}
                                    onChange={handleSelectSection}
                                    options={sections?.result}
                                    getOptionLabel={option => option.sectionName + " (" + option.sectionCode + ")"}
                                    getOptionValue={option => option.id.toString()}
                                    classNamePrefix="select2-selection"
                                />
                                {!section && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>

                        </Row>}

                        {subSections && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Sub Section Name
                            </label>
                            <div className="col-md-10">
                                <Select

                                    value={subSection}
                                    onChange={handleSelectSubSection}
                                    options={subSections?.result}
                                    getOptionLabel={option => option.subSectionName + " (" + option.subSectionCode + ")"}
                                    getOptionValue={option => option.id.toString()}
                                    classNamePrefix="select2-selection"
                                />
                                {!subSection && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>

                        </Row>}

                        {difficultys && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Difficulty Name
                            </label>
                            <div className="col-md-10">
                                <Select

                                    value={difficulty}
                                    onChange={handleSelectDifficulty}
                                    options={difficultys?.difficultys?.result}
                                    getOptionLabel={option => option.difficultyName}
                                    getOptionValue={option => option.id.toString()}
                                    classNamePrefix="select2-selection"
                                />
                                {!difficulty && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>

                        </Row>}
                        {languages && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Language Name
                            </label>
                            <div className="col-md-10">
                                <Select

                                    value={language}
                                    onChange={handleSelectLanguage}
                                    options={languages?.languages?.result}
                                    getOptionLabel={option => option.languageName}
                                    getOptionValue={option => option.id.toString()}
                                    classNamePrefix="select2-selection"
                                />
                                {!language && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>

                        </Row>}

                        <Row className="mb-3">
                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                Question Type
                            </label>
                            <div className="col-md-10">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="type"
                                        id="type2"
                                        value="short"
                                        checked={type === 'short'}
                                        onChange={handleTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        Short
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="type"
                                        id="type1"
                                        value="mcq"
                                        checked={type === 'mcq'}
                                        onChange={handleTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios1">
                                        MCQ
                                    </label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="type"
                                        id="type3"
                                        value="true false"
                                        checked={type === 'true false'}
                                        onChange={handleTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        True False
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="type"
                                        id="type4"
                                        value="essay"
                                        checked={type === 'essay'}
                                        onChange={handleTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        Essay
                                    </label>
                                </div>
                            </div>
                        </Row>

                        <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Question Description
                            </label>
                            <div className="col-md-10">
                                <div className="card">
                                    <RichTextEditorComponent id="defaultRTE" ref={(scope) => { rteObj = scope; }} valueTemplate={template} toolbarSettings={toolbarSettings}>
                                        <Inject services={[HtmlEditor, Toolbar, Link, Image, QuickToolbar]} />
                                    </RichTextEditorComponent>

                                </div>
                            </div>
                        </Row>
                        {type === "short" && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Answer
                            </label>
                            <div className="col-md-10">
                                <input type="text"
                                    className='form-control'
                                    placeholder="Enter Answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)} />
                                {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>
                        </Row>}
                        {type === "mcq" &&
                            <>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        {/* Answer */}
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control col-md-4 mb-2'
                                            onChange={(e) => { setOption(e.target.value) }}
                                            placeholder="write a option"
                                            value={option} />

                                        <button type="button" className="btn btn-primary w-md me-2 " onClick={addOption}>Add Option</button>
                                        <button type='button' className="btn btn-primary me-2" onClick={handleSetOptionsClick} >{editOptionText}</button>
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Select Answer
                                    </label>
                                    <div className="col-md-10">
                                        {options?.map((o, i) => (
                                            <>
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="radio"
                                                        name="options"
                                                        id={i}
                                                        value={o}
                                                        checked={answer === o}
                                                        onChange={(e) => setAnswer(e.target.value)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="exampleRadios1"
                                                    >
                                                        {o}
                                                    </label>
                                                    <button type='button' className="text-danger" onClick={() => removeOption(i)} style={{ fontSize: "1rem", background: "none", border: "none", fontWeight: "bolder", display: `${optionsEditDisplay}` }}> <i className="mdi mdi-delete "></i></button>

                                                </div>
                                            </>
                                        ))}
                                        {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                            </>
                        }
                        {type === "true false" && <Row className="mb-3">
                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                Answer
                            </label>
                            <div className="col-md-10">
                                <div className="">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="answer"
                                            id="answer1"
                                            value="true"
                                            checked={answer === 'true'}
                                            onChange={(e) => setAnswer(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="exampleRadios2">
                                            True
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="answer"
                                            id="answer2"
                                            value="false"
                                            checked={answer === 'false'}
                                            onChange={(e) => setAnswer(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="exampleRadios2">
                                            false
                                        </label>
                                    </div>
                                </div>
                                {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>
                        </Row>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleUpdate} className="waves-effect waves-light">Update</Button>{" "}
                    <Button type="button" color="danger" onClick={() => { setDeleteModalShow(true); setModalShow(false) }} className="waves-effect waves-light">Delete</Button>{" "}
                    {/* <Button onClick={() => setModalShow(false)}>Close</Button>
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button onClick={handleDelete}>Delete</Button> */}
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
                        Are you sure want to remove this question.
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

export default connect(null, { setBreadcrumbItems })(AllQuestions);


