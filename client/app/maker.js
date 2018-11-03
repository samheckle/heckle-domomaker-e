// comment to force build
const handleDomo = (e) => {
    e.preventDefault();
    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == ''|| $("#domoColor").val() == '') {
        handleError("All fields required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer($("#token").val());
    });

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
    
    console.dir($("#deleteDomo").serialize())
    sendAjax('POST', $("#deleteDomo").attr("action"), $("#deleteDomo").serialize(), function () {
        loadDomosFromServer($("#token").val());
    });

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="color">Color: </label>
            <input id="domoColor" type="text" name="color" placeholder="Domo Color" />
            <input id="token" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    )
}

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <div key={domo._id} className="domo" style={{backgroundColor: domo.color}}>
                <form id="deleteDomo" onSubmit={handleDelete} action="/deleteDomo" method='POST' style={{position: "absolute", right: "2%"}}>
                    <input type="hidden" name="_id" value={domo._id} />
                    <input id="token" type="hidden" name="_csrf" value={props.csrf} />
                    <input style={{height: "20px"}} type="image" src="/assets/img/trash.png" border="0" alt="Submit" />
                </form>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
            </div>
        );
    });

    return (
        <div className="domoList" style={{position: "relative"}}>
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    console.dir(csrf)
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrf} />,
            document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf} />,
        document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});