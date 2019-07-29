import React, { Component } from "react";
//import React, { useState, Fragment } from "react";
import s from "./app.component.scss";

import jQuery from 'jquery';
import bootstrap from 'bootstrap';
import popper from 'popper.js';

jQuery(function() {
    //jQuery('body').css('color', 'blue');
});

class MyComponent extends Component {
    render() {
        return <div className={s.intro}>Hello World</div>;
    }
}
export default MyComponent;

/*function MyComponent(props) {
    const [name, setState] = useState("anshul");
    const handleCahnge = e => setState(e.target.value);
    return (
        <Fragment>
        <div className={s.intro}>{name}</div>
        <input value={name} onChange={handleCahnge} />
        </Fragment>
    );
}

export default MyComponent;*/