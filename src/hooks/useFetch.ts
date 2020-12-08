import { useEffect, useState } from 'react'

export enum Status {
	idle,
	loading,
	error,
	success,
}

const useFetch = <T>(
	url: string,
): {
	isIdle: boolean
	isLoading: boolean
	isError: boolean
	isSuccess: boolean
	error: Error
	status: Status
	data: T[]
} => {
	const [status, setStatus] = useState(Status.idle)
	const [data, setData] = useState<T[]>([])
	const [error, setError] = useState<Error>(Error)

	useEffect(() => {
		if (!url) throw new Error('A URL must be provided to the useFetch hook')

		const fetchData = async () => {
			try {
				setStatus(Status.loading)
				const response = await fetch(url)
				const data = await response.json()
				setData(data)
				setStatus(Status.success)
			} catch (error) {
				setStatus(Status.error)
				setError(error)
			}
		}
		fetchData()
	}, [])

	return {
		isIdle: status === Status.idle,
		isLoading: status === Status.loading,
		isError: status === Status.error,
		isSuccess: status === Status.success,
		error,
		status,
		data,
	}
}

export { useFetch }
