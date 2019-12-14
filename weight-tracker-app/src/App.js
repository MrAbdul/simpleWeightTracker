import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import LineChart from 'react-linechart'
class SetData extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      age: "",
      gender: "",
      weights: [],
      dataIsSet: false
    }




  }
  SetData = async e => {
    e.preventDefault();
    // alert(e.target["age"].value);
    this.setState({ name: this.props.name, age: e.target["age"].value, gender: e.target["gender"].value, weights: this.props.weights.concat(e.target["weights"].value), dataIsSet: true }, () => {
      axios.post("/setdata", {
        name: this.state.name,
        age: this.state.age,
        gender: this.state.gender,
        weights: this.state.weights,

      })
      // alert("name from set data" + this.state.name)
    })
  }
  render() {
    return (
      <div>
        {this.state.dataIsSet ? <DisplayData name={this.state.name} age={this.state.age} gender={this.state.gender} weights={this.state.weights} /> : <div> <h1> hello {this.props.name} please enter the following details</h1>

          <form onSubmit={this.SetData}>
            <label>age:</label>
            <input type="number" name="age"></input>
            <label>gender:</label>
            <input type="text" name="gender"></input>
            <label>weights:</label>
            <input type="number" name="weights"></input><label>kg</label>
            <br></br>
            <input type="submit"></input>
          </form>
        </div>
        }
      </div>
    )
  }
}

class DisplayData extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      age: this.props.age,
      gender: this.props.gender,
      weights: this.props.weights
    }
  }

  addWeight = async e => {
    e.preventDefault();
    this.setState({ weights: this.state.weights.concat(e.target[0].value) }, () => {
      axios.post("/addWeight", {
        name: this.state.name,
        weights: this.state.weights
      })
    })



  }
  render() {
    let points = []
    let i = 1;
    points.push({ x: 0, y: 0 })
    this.state.weights.forEach(e => {
      let dp = { x: i, y: e }
      console.log(dp)
      points.push(dp);
      i++


    });
    const data = [{
      color: "steelblue",
      points: points
    }]
    return (
      <div>
        <h1>Hello {this.state.name}</h1>
        <h4>you are {this.state.age} yeares old</h4>
        <h4>your weight is {JSON.stringify(points)}</h4>
        <LineChart width={600} height={400} data={data} yLabel="weight(kg)" />
        <form onSubmit={this.addWeight}>
          <label>add new weight</label>
          <input type="number"></input><label>kg</label>
          <input type="submit"></input>
        </form>
      </div>
    )
  }
}
class GetData extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      age: 0,
      gender: "",
      weights: [],
      dataSet: false
    }
  }
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    axios.get("/loadData", {
      params: {
        name: this.props.name
      }
    })
      .then((resp) => {
        // alert("local Data: " + JSON.stringify(resp.data.name));
        this.setState({
          name: resp.data.name,
          age: resp.data.age,
          gender: resp.data.gender,
          weights: resp.data.weights
        }, () => {
          // alert("weights from db " + this.state.weights)
          if (this.state.age == 0 || this.state.gender == "") {
            this.setState({ dataSet: false });

          } else {
            this.setState({ dataSet: true });
          }
        })

      })
  }

  render() {
    return (
      <div>
        {this.state.dataSet ? <DisplayData name={this.state.name} age={this.state.age} gender={this.state.gender} weights={this.state.weights} /> : <SetData name={this.state.name} weights={this.state.weights} />}

      </div>
    )
  }
}
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      exists: false
    }
  }
  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ name: e.target[0].value }, () => {
      axios.get('/checkName', {
        params: {
          name: this.state.name
        }
      })
        .then((res) => {
          // JSON.stringify(res.data)
          if (JSON.parse(JSON.stringify(res.data)).data == false) {
            // alert(this.state.name)
            axios.post("/addNew", {
              name: this.state.name,
              age: 0,
              gender: "",
              weights: []
            })
            // alert("false")
          } else {
            // alert(JSON.stringify(res.data));
            this.setState({ exists: true });
            // this.forceUpdate()


          }
        })
        .catch(function (err) {
          // alert(err);
        })


    })
  }
  render() {
    return (
      <div>
        {this.state.exists ? <GetData name={this.state.name} /> : <div className="App">

          <form onSubmit={this.handleSubmit}>
            <label>Name:</label>
            <input name="nameInput" type="text"></input>



            <input type="submit"></input>

          </form>
          <p>name from state: {this.state.name}</p>
        </div>}
      </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      exists: false
    }

    this.nameRef = React.createRef();
  }





  enterName = () => {

  }
  render() {
    return (
      <div>
        <Login />
      </div>
    )
  }
}



export default App;
