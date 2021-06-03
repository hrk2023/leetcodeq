import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Spinner from "react-bootstrap/Spinner";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./Topic.css";
import{  
	FaAmazon,
	FaFacebookSquare,
	FaMicrosoft,
	FaGoogle,
	FaApple,
	FaUber,
	FaTwitter,
	FaAirbnb,
	FaPaypal,
	FaEbay,
	FaAdobe,
	FaLinkedin,
	FaSalesforce,
	FaPinterest,
	FaDropbox,
	FaAd

} from 'react-icons/fa'

import {SiTesla, SiIbm, SiVmware} from 'react-icons/si'

export default function Topic({ data, updateData }) {
	/*
	  This component takes data releted to a paticular topic 
	  and updateData() from App component
	*/

	/*
	  Setting state for fields that comes from `data` prop 
	  so that `data` prop is not undefined on reload
	*/
	const [select, setSelected] = useState([]);
	const [questionsTableData, setQuestionsTableData] = useState([]);
	const [topicName, setTopicName] = useState("");

	// updating states using useEffect with dependency  on `data` prop
	useEffect(() => {
		if (data !== undefined){ 
			let doneQuestion = [];
			let tableData = data.questions.map((question, index) => {
				if (question.Done) {
					doneQuestion.push(index);
				}

				/*
				|	Hidden properties `_is_selected` and `_search_text` are used to sort the table
				|	and search the table respectively. react-bootstrap-table does not allow sorting
				|	by selectRow by default, and requires plain text to perform searches.
				*/
				return {
					id: index,
					question: (
						<>
						<a href={question.URL} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "600" }}>
							{question.Problem}
						</a><br/>
						<a href={question.Youtube} target="_blank" rel="noopener noreferrer"
						style={{ fontWeight: "400"}}>
							Solution
						</a><br/><br/>
						<p>
							<div className="companies-icon">
                {question.Amazon && <FaAmazon className="c-icon"/>}
								{question.Google && <FaGoogle className="c-icon"/>}
								{question.Facebook && <FaFacebookSquare className="c-icon"/>}
								{question.Microsoft && <FaMicrosoft className="c-icon"/>}
								{question.Apple && <FaApple className="c-icon"/>}
								{question.Uber && <FaUber className="c-icon"/>}
								{/* {question.Expedia && <img  /> */}
								{question.Twitter && <FaTwitter className="c-icon"/>}
								{/* {question.ByteDance && <img  /> */}
								{question.Airbnb && <FaAirbnb className="c-icon"/>}
								{question.Paypal && <FaPaypal className="c-icon"/>}
								{/* {question.Bloomberg && <FaBloom /> */}
								{/* {question.Oracle && <img  /> */}
								{question.eBay && <FaEbay className="c-icon" attribute="Ebay"/>}
								{/* {question.Snap && < /> */}
								{question.Adobe && <FaAdobe className="c-icon"/>}
								{question.LinkedIn && <FaLinkedin className="c-icon"/>}
								{/* {question.Citedal && <img  /> */}
								{question.Salesforce && <FaSalesforce className="c-icon"/>}
								{/* {question.Robinhood && <img  /> */}
								{question.Pinterest && <FaPinterest className="c-icon"/>}
								{/* {question.Wish && <img  /> */}
								{question.Tesla && <SiTesla className="c-icon"/>}
								{question.IBM && <SiIbm className="c-icon"/>}
								{question.Dropbox && <FaDropbox className="c-icon"/>}
								{question.VMWare && <SiVmware className="c-icon"/>}
							</div>
						</p>
						</>
					),
					_is_selected: question.Done,
					_search_text: question.Problem,
				};
			});
			setQuestionsTableData(tableData);
			setTopicName(data.topicName);
			setSelected(doneQuestion);
		}
	}, [data]);

	// seacrh bar config
	const SearchBar = (props) => {
		const handleChange = (e) => {
			props.onSearch(e.target.value);
		};
		return (
			<div className="container container-custom2">
				<InputGroup className="mb-4">
					<FormControl
						className="text-center"
						placeholder="Search Question.. 🔍"
						aria-label="Search Question"
						aria-describedby="basic-addon2"
						onChange={handleChange}
					/>
				</InputGroup>
			</div>
		);
	};

	// table config
	const columns = [
		{
			dataField: "id",
			text: "Q-Id",
			headerStyle: { width: "130px", fontSize: "20px" },
		},
		{
			dataField: "question",
			text: "Questions",
			headerStyle: { fontSize: "20px" },
		},
		{
			dataField: "_is_selected",
			text: "Is Selected",
			headerStyle: { fontSize: "20px" },
			hidden: true,
			sort: true,
		},
		{
			dataField: "_search_text",
			text: "Search Text",
			headerStyle: { fontSize: "20px" },
			hidden: true,
		},
	];
	const rowStyle = { fontSize: "20px" };
	const selectRow = {
		mode: "checkbox",
		style: { background: "#c8e6c9" },
		selected: select,
		onSelect: handleSelect,
	};
	const sortMode = {
		dataField: "_is_selected",
		order: "asc",
	};

	// func() triggered when a question is marked done
	function handleSelect(row, isSelect) {
		let key = topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
		let newDoneQuestion = [...select];
		let updatedQuestionsStatus = data.questions.map((question, index) => {
			if (row.id === index) {
				question.Done = isSelect;
				if (isSelect) {
					newDoneQuestion.push(row.id);
				} else {
					var pos = newDoneQuestion.indexOf(row.id);
					newDoneQuestion.splice(pos, 1);
				}
				return question;
			} else {
				return question;
			}
		});
		updateData(
			key,
			{
				started: newDoneQuestion.length > 0 ? true : false,
				doneQuestions: newDoneQuestion.length,
				questions: updatedQuestionsStatus,
			},
			data.position
		);
		displayToast(isSelect, row.id);
	}

	// trigger an information message for user on select change
	function displayToast(isSelect, id) {
		const { type, icon, verb, dir } = {
			type: isSelect ? "Done" : "Incomplete",
			icon: isSelect ? "🎉" : "🙇🏻‍♂️",
			dir: isSelect ? "👇🏻" : "👆🏻",
		};

		const title = `Q-${id} Marked ${type} ${icon}`;
		const subTitle = `Question pushed to the ${dir} of the table.`;

		const Card = (
			<>
				<p>{title}</p>
				<p class="toast-subtitle">{subTitle}</p>
			</>
		);

		toast(Card, {
			className: `toast-${type}`,
			autoClose: 2000,
			closeButton: true,
		});
	}

	return (
		<>
			<h3 className="text-center mb-4">
				<Link to="/">Topics</Link>/{topicName}
			</h3>

			{data === undefined ? (
				<div className="d-flex justify-content-center">
					<Spinner animation="grow" variant="success" />
				</div>
			) : (
				<ToolkitProvider className="float-right" keyField="id" data={questionsTableData} columns={columns} rowStyle={rowStyle} search>
					{(props) => (
						<div>
							<SearchBar {...props.searchProps} />
							<div className="container container-custom" style={{ overflowAnchor: "none" }}>
								<Fade duration={600}>
									<BootstrapTable {...props.baseProps} selectRow={selectRow} sort={sortMode} />
								</Fade>
							</div>
						</div>
					)}
				</ToolkitProvider>
			)}
			<ToastContainer />
		</>
	);
}
