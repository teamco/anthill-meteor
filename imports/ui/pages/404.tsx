import React, { JSX } from "react";
import { useRouteError } from "react-router-dom";

type TError = {
	status?: number;
	statusText?: string;
	message?: string;
}

const Page404: React.FC = (): JSX.Element => {
	const error: TError = useRouteError();
	console.error(error);

	return (
		<div id={"error-page"}>
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error?.statusText || error?.message}</i>
			</p>
		</div>
	);
}

export default Page404;