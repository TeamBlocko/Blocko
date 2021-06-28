import Roact, { JsxObject, Children } from "@rbxts/roact";
import { validateText } from "template/shared/utility";

interface OnValidInput {
	(e: TextBox, value: number): void;
}

interface NumberInputPropTypes {
	OnValidInput: OnValidInput;
	Options: ValidateTextOptions;
	TextBoxProps: Omit<JsxObject<TextBox>, "Key">;
}

function NumberInput(props: NumberInputPropTypes) {

	let prevText = props.TextBoxProps.Text;
	return (
		<textbox
			{...props.TextBoxProps}
			Event={{
				FocusLost: (element, a, inputObject) => {
					props.TextBoxProps.Event?.FocusLost?.(element, a, inputObject);
					if (element.Text === "" && prevText !== undefined) {
						element.Text = prevText as string;
					}
				},
			}}
			Change={{
				Text: (element) => {
					props.TextBoxProps.Change?.Text?.(element);
					const output = validateText(element.Text, props.Options);
					const text = tostring(output);
					if (output === undefined || text === undefined) return;
					props.OnValidInput(element, output);
					prevText = text;
					element.Text = text;
				},
			}}
		>
			{props.TextBoxProps[Children]}
		</textbox>
	);
}

export default NumberInput;
