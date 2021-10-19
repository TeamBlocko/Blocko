import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import { validateText } from "common/shared/utility";

interface OnValidInput {
	(e: TextBox, value: number): void;
}

interface NumberInputPropTypes {
	OnValidInput: OnValidInput;
	Options: ValidateTextOptions;
	TextBoxProps: Omit<Roact.JsxInstance<TextBox>, "Text"> & { Text: string };
}

function NumberInput(props: PropsWithChildren<NumberInputPropTypes>) {
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
					const [originalText] = element.Text.gsub("%s", "");
					if (originalText === "") return;
					if (
						originalText.match("%d+%.")[0] !== undefined &&
						originalText.match("%d+%.(%d+)")[0] === undefined
					)
						return;
					const output = validateText(originalText, props.Options);
					if (output === undefined) {
						element.Text = prevText;
						return
					};
					const text = `%.${props.Options.decimalPlace}f`.format(output);
					if (text === prevText && originalText === prevText) return;
					element.Text = text;
					props.OnValidInput(element, output);
					prevText = text;
				},
			}}
		>
			{props[Children]}
		</textbox>
	);
}

export default NumberInput;
