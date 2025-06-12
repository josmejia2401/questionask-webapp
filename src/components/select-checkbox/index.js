import React from 'react';

/**
 * Componente personalizado para seleccionar múltiples opciones con checkboxes dentro de un dropdown (Tailwind).
 */
class SelectCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show: false,
        };
    }

    componentDidMount() {
        this.updateCheckboxData(this.props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data || prevProps.value !== this.props.value) {
            this.updateCheckboxData(this.props);
        }
    }

    updateCheckboxData(props) {
        if (props.data) {
            const updatedData = props.data.map(p => ({
                ...p,
                checked: props.value ? props.value.includes(p.code) : false,
            }));
            this.setState({ data: updatedData });
        }
    }

    handleOnChange = (event, index) => {
        const { checked } = event.target;
        const updatedData = [...this.state.data];
        updatedData[index].checked = checked;
        this.setState({ data: updatedData });

        if (this.props.handleSetChangeInputEvent) {
            event.target.name = this.props.schema.id;
            event.target.value = updatedData.filter(p => p.checked).map(p => p.code);
            this.props.handleSetChangeInputEvent(event);
        }
    };

    handleShow = () => {
        this.setState(prevState => ({ show: !prevState.show }));
    };

    render() {
        const { schema, errors, disabled } = this.props;
        const { data, show } = this.state;

        if (!data.length) return null;

        const isInvalid = errors && errors[schema.id];

        return (
            <div className="w-full mb-4">
                <label htmlFor={schema.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {schema.name} {schema.required && <span className="text-red-500">*</span>}
                </label>

                <div className="relative w-full">
                    <button
                        type="button"
                        className={`w-full bg-white border ${isInvalid ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none`}
                        onClick={this.handleShow}
                        disabled={disabled}
                    >
                        Selección múltiple
                        <span className="float-right">&#9662;</span>
                    </button>

                    {show && (
                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {data.map((item, index) => (
                                <li key={item.code} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <div className="flex items-center">
                                        <input
                                            id={item.code}
                                            name={item.code}
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={(e) => this.handleOnChange(e, index)}
                                            disabled={disabled}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor={item.code} className="ml-2 block text-sm text-gray-700">
                                            {item.name}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {isInvalid && (
                    <p className="text-red-500 text-sm mt-1">{errors[schema.id]}</p>
                )}
            </div>
        );
    }
}

export default SelectCheckbox;
