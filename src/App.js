import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { getData, updateDBData, resetDBData, exportDBData, importDBData } from "./services/dbServices";
import { saveAs } from 'file-saver';
import Spinner from "react-bootstrap/Spinner";
import TopicCard from "./components/TopicCard/TopicCard";
import Topic from "./components/Topic/Topic";
import ReactGA from "react-ga";
import "./App.css";

function App() {

	// setting state for data received from the DB
	const [questionData, setquestionData] = useState([]);

	// useEffect for fetching data from DB on load and init GA
	useEffect(() => {
		console.log('in use effect')
		ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
		ReactGA.pageview(window.location.pathname + window.location.search);
		getData((QuestionData) => {
			setquestionData(QuestionData);
		});
	}, []);

	//to update progress in '/' route and also update DB
	function updateData(key, topicData, topicPosition) {
		let reGenerateUpdatedData = questionData.map((topic, index) => {
			if (index === topicPosition) {
				updateDBData(key, topicData);
				return { topicName: topic.topicName, position: topic.position, ...topicData };
			} else {
				return topic;
			}
		});
		setquestionData(reGenerateUpdatedData);
	}

	// reset and clear DB 
	function resetData() {
		resetDBData((response) => {
			setquestionData([]);
			window.location.replace(window.location.origin);
		});
	}

	// export 450DSA-Progress data

	function exportData(callback) {
		exportDBData((data) => {
			const fileData = JSON.stringify(data);
			const blob = new Blob([fileData], { type: "text/plain" });
			saveAs(blob, 'progress.json')
			callback()
		})
	}

	// import 450DSA-Progress data

	function importData(data, callback) {
		importDBData(data, (QuestionData) => {
			console.log(QuestionData)
			setquestionData(QuestionData);
			callback()
		});
	}

	return (
		<Router>
			<div className="App">
				<h1 className="app-heading text-center mt-5">Leetcode Questions</h1>
				{questionData.length === 0 ? (
					// load spinner until data is fetched from DB
					<div className="d-flex justify-content-center">
						<Spinner animation="grow" variant="success" />
					</div>
				) : (
						<>
							{/* HOME AND ABOUT ROUTE */}
							<Route exact path="/" children={<TopicCard questionData={questionData}></TopicCard>} />

							{/* TOPIC ROUTE */}
							
							{questionData.map((item) => <Route path={`/${item.topicName}`.toLowerCase()} children={<Topic data={item} updateData={updateData} />} />)}
						</>

					)}
			</div>
		</Router>
	);
}

export default App;
