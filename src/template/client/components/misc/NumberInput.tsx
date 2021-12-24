import Roact, { Children, PropsWithChildren } from "@rbxts/roact";

interface NumberInputPropTypes {
	OnValidInput: (e: TextBox, value: number) => void;
	ValidationHandler: (input: string) => string | undefined;
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
					if (element.Text === "") {
						element.Text = prevText;
					}
				},
			}}
			Change={{
				Text: (element) => {
					props.TextBoxProps.Change?.Text?.(element);
					if (element.Text === prevText) return;
					const output = props.ValidationHandler(element.Text);
					if (!output) return element.Text = prevText;
					element.Text = output;
					props.OnValidInput(element, tonumber(output)!);
					prevText = output;
				},
			}}
		>
			{props[Children]}
		</textbox>
	);
}

export default NumberInput;
