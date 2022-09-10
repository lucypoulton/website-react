import React, {AnchorHTMLAttributes, SyntheticEvent, useCallback} from 'react'
import {useLocation} from 'wouter'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string
}

export function useFancyNavigate() {
	const [, setLocation] = useLocation();

	return (path: string) => {
		if (path.match(/\w+:\/\//)) window.location.href = path;
		else setLocation(path);
	}
}

function Link(props: LinkProps) {
	const navigate = useFancyNavigate();
	const callback = useCallback((e: SyntheticEvent) => {
		e.preventDefault();
		navigate(props.href)
	}, [props.href])


	return <a {...props} onClick={callback}>{props.children}</a>
}

export default React.memo(Link);
