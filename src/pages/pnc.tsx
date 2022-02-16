import { stat } from "fs";
import {FormEvent, FormEventHandler, useReducer} from "react";
import "./pnc.css";

export interface PronounSet {
	[key: string]: string | boolean;

	subjective: string;
	objective: string;
	possessiveAdj: string;
	possessivePro: string;
	reflexive: string;
	plural: boolean;
}

interface Field {
	prefix?: string,
	suffix?: string,
	default: string,
	property: string
}


const capitalise = (input: string): string => {
	if (input.length == 0) return input;
	if (input.length == 1) return input.toUpperCase();
	return input[0].toUpperCase() + input.substring(1).toLowerCase();
}

const fields: Array<Field> = [
	{
		property: "subjective",
		default: "They",
		suffix: " will do it if you ask nicely."
	},
	{
		property: "objective",
		prefix: "I'd really love to get to know",
		default: "them",
		suffix: "."
	},
	{
		property: "possessiveAdj",
		prefix: "I hope ",
		default: "their",
		suffix: " day is going well."
	},
	{
		property: "possessivePro",
		prefix: "Whose is that? Oh, it's ",
		default: "theirs",
		suffix: "."
	},
	{
		property: "reflexive",
		prefix: "This person should be really proud of ",
		default: "themself",
		suffix: "."
	}
];

export function PronounsCloudPage() {
	function reducer(state: PronounSet, action: { [k in keyof PronounSet]?: PronounSet[k] }): PronounSet {
		return {...state, ...action} as PronounSet;
	}

	const [state, dispatch] = useReducer(reducer, {
		subjective: '',
		objective: '',
		possessiveAdj: '',
		possessivePro: '',
		reflexive: '',
		plural: true
	})

	const onInput = (event: FormEvent<HTMLInputElement>) => {
		dispatch({[event.currentTarget.name]: event.currentTarget.value});
	}

	return <>
	<h2>Set your pronouns</h2>
	<h4>For servers running ProNouns 2.1.0 and above</h4>
	<div className="pnc-fields">
		{fields.map(field => <label htmlFor={field.property} key={field.property}>
		{field.prefix}
		<input type="text" 
		id={field.property} 
		name={field.property} 
		placeholder={field.default} 
		onInput={onInput}
		required/>
		{field.suffix}
	</label>)}
	<label htmlFor="plural">Plural <input type="checkbox" id="plural" name="plural" defaultChecked onInput={() => dispatch({plural: !state.plural})}/>
    <div>{capitalise(state.subjective || "They")} {state.plural ? "are" : "is"} using a {state.plural ? "plural" : "singular"} pronoun set.</div>
  </label>
  {fields.some(field => state[field.property] === '') ? 
	<h4>Make sure to fill out all the boxes.</h4>:
	<code>/pronouns set {state.subjective}/{state.objective}/{state.possessiveAdj}/{state.possessivePro}/{state.reflexive}{state.plural ? ":p" : ""}</code>
		}</div>
	</>;
}