import styled from '@emotion/styled'
import React from 'react'
import { useFetch } from './hooks/useFetch'

const apiURL = 'https://fetch-hiring.s3.amazonaws.com/hiring.json'

interface Item {
	id: number
	listId: number
	name: string
}

const sortData = (arr: Item[]) => {
	// creating a numeric collator to allow comparison of the numbers within the item name strings - "Item 123"
	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
	// sorting the array by listId and name
	return arr.sort((a, b) => {
		// if the listId's are the same sort them by name in ascending order
		if (a.listId === b.listId) {
			return collator.compare(a.name, b.name)
		}
		// otherwise sort by listId
		return a.listId > b.listId ? 1 : -1
	})
}

function ListItems({ items }: { items: Item[] }): JSX.Element {
	return (
		<StyledList>
			{items.map((item) => (
				<StyledListItem key={item.id}>
					<div>List ID: {item.listId}</div>
					<div>{item.name}</div>
				</StyledListItem>
			))}
		</StyledList>
	)
}

function ErrorMessage({ error }: { error: Error }): JSX.Element {
	return (
		<StyledError>
			<p>Uh oh! Something went wrong</p>
			<pre>
				{error.name}: {error.message}
			</pre>
		</StyledError>
	)
}

function App(): JSX.Element {
	// The server that the api data comes from does not have cors enabled
	// (which blocked me from requesting the data from localhost), so I set
	// up a proxy server (../server.js) using 'cors-anywhere'.
	// This requires that the project be run using `npm run serve` or running
	// `npm start` and `node server.js` in separate terminals.
	const { data, error, isLoading, isError, isSuccess } = useFetch<Item>(`http://localhost:8080/${apiURL}`)
	// filter out items whose name is an empty string or null
	const filteredData = isSuccess ? data.filter((item) => item.name) : []
	const sortedData = isSuccess ? sortData(filteredData) : []

	return (
		<StyledContainer>
			<StyledHeader>
				<h1>Cody Rose - Front End Engineer Exercise</h1>
			</StyledHeader>
			<StyledMain>
				{isLoading ? <p>Loading...</p> : isError && <ErrorMessage error={error} />}
				{isSuccess ? <ListItems items={sortedData} /> : null}
			</StyledMain>
		</StyledContainer>
	)
}

const StyledContainer = styled.main`
	padding: 2rem 2rem;
`
const StyledHeader = styled.header`
	text-align: center;
	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}
`
const StyledMain = styled.div`
	display: flex;
	justify-content: center;
`
const StyledList = styled.ul`
	width: 100%;
	list-style-type: none;
	padding: 1rem 2rem;
	margin: 0;
	border-radius: 4px;
	max-width: 32rem;
	background-color: #eee;
`
const StyledListItem = styled.li`
	display: flex;
	padding: 1rem 0;
	&:not(:last-of-type) {
		border-bottom: 1px solid #fff;
	}
	div:first-of-type {
		margin-right: 2rem;
	}
`
const StyledError = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	pre {
		padding: 1rem 2rem;
		margin-top: 0;
		background-color: #eee;
		max-width: 500px;
		overflow-x: auto;
	}
`

export default App
