import React, { JSX } from "react";
// import { useRouteError } from "@tanstack/react-router";

type TError = {
	status?: number;
	statusText?: string;
	message?: string;
}

const Page404: React.FC = (): JSX.Element => {
	// const error: TError = useRouteError();
	// console.error(error);

	return <>404 Not Found</>;
	// (
	// 	<div id={"error-page"}>
	// 		<h1>Oops!</h1>
	// 		<p>Sorry, an unexpected error has occurred.</p>
	// 		<p>
	// 			<i>{error?.statusText || error?.message}</i>
	// 		</p>
	// 	</div>
	// );
}

export default Page404;