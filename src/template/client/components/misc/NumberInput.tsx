import Roact, { JsxObject, Children } from "@rbxts/roact";
import { copy } from "@rbxts/object-utils";
import { validateText } from "template/shared/utility";

interface OnValidInput {
	(e: TextBox, value: number): void;
}

interface NumberInputPropTypes extends JsxObject<TextBox> {
	OnValidInput: OnValidInput;
	Options?: ValidateTextOptions;
}

interface ValidProps extends JsxObject<TextBox> {
	OnValidInput?: OnValidInput;
	Options?: ValidateTextOptions;
}

function NumberInput(props: NumberInputPropTypes) {
	const textChange = props.Change?.Text;
	const focusLost = props.Event?.FocusLost;

	const validProps: ValidProps = copy(props);

	const children = validProps[Children];
	const onValidInput = validProps.OnValidInput as OnValidInput;
	const options = validProps.Options;

	validProps[Children] = undefined;
	validProps.OnValidInput = undefined;
	validProps.Options = undefined;

	let prevText = props.Text;
	return (
		<textbox
			{...validProps}
			Event={{
				FocusLost: (element, a, inputObject) => {
					focusLost === undefined || focusLost(element, a, inputObject);
					if (element.Text === "" && prevText !== undefined) {
						element.Text = prevText as string;
					}
				},
			}}
			Change={{
				Text: (element) => {
					textChange === undefined || textChange(element);
					const output = validateText(element.Text, options);
					const text = tostring(output);
					if (output === undefined || text === undefined) return;
					onValidInput(element, output);
					prevText = text;
					element.Text = text;
				},
			}}
		>
			{children}
		</textbox>
	);
}

export default NumberInput;
