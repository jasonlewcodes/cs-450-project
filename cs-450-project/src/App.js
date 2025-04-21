import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";
import depression from "./student_depression_dataset.csv";
import VisualizationOne from "./VisualizationOne";
import VisualizationTwo from "./VisualizationTwo";
import VisualizationThree from "./VisualizationThree";
import VisualizationFour from "./VisualizationFour";
import VisualizationFive from "./VisualizationFive";
import VisualizationSix from "./VisualizationSix";

class App extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }
  componentDidMount() {
    d3.csv(depression)
      .then((data) => {
        this.setState({
          data: data.map((d) => ({
            id: Number(d.id),
            gender: d["Gender"],
            age: Number(d["Age"]),
            city: d["City"],
            profession: d["Profession"],
            academicPressure: Number(d["Academic Pressure"]),
            workPressure: Number(d["Work Pressure"]),
            cgpa: Number(d["CGPA"]),
            studySatisfaction: Number(d["Study Satisfaction"]),
            jobSatisfaction: Number(d["Job Satisfaction"]),
            sleepDuration: d["Sleep Duration"],
            dietaryHabits: d["Dietary Habits"],
            degree: d["Degree"],
            suicidalIdeation: d["Have you ever had suicidal thoughts ?"],
            workStudyHours: Number(d["Work/Study Hours"]),
            financialStress: Number(d["Financial Stress"]),
            familyHistory: Boolean(d["Family History of Mental Illness"]),
            depression: Number(d["Depression"]),
          })),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  render() {
    console.log(this.state.data);
    return (
      <div>
        {this.state.data.length > 0 && (
          <>
            <VisualizationOne data={this.state.data} />
            <VisualizationTwo data={this.state.data} />
            <VisualizationThree data={this.state.data} />
            <VisualizationFour data={this.state.data} />
            <VisualizationFive data={this.state.data} />
            <VisualizationSix data={this.state.data} />
          </>
        )}
      </div>
    );
  }
}

export default App;
