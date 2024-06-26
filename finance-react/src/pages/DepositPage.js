import { useState, useEffect } from "react";
import { BalanceCard } from "../components/BalanceCard";
import Button from "../components/custom/Button";
import { userPhoneNumber } from "../utils/finance";
import { Deposit } from "../utils/finance";
import { formatDate, formatRelativeTime } from "../utils/strings";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; //notification

import { queryKeys } from "../utils/constants";

export default function DepositPage() {
	const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
	const [amount, setAmount] = useState(0);

	const depositsQuery = useQuery({ queryKey: queryKeys.deposits });
	const queryClient = useQueryClient();

	async function init() {
		queryClient.invalidateQueries(queryKeys.deposits);
	}

	async function handleSubmit(e) {
		// prevent the page from reloading
		e.preventDefault();

		if (amount <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		// make a deposit
		const deposit = new Deposit(phoneNumber, parseFloat(amount));
		await deposit.save();

		// refresh page data
		setAmount(0);
		init();

		//notification
		const myPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve({ name: "Success" });
			}, 500);
		});

		toast.promise(myPromise, {
			loading: "Depositing...",
			success: `  ${amount} has been Deposited`,
			error: "Error Occurred",
		});
	}
	return (
		<div className="flex flex-col gap-8 px-4 py-8">
			<BalanceCard />

			<form onSubmit={handleSubmit} className="grid gap-4 rounded-xl  border-2 border-black bg-light-bg p-4 shadow-sm">
				<h1 className="font-mono text-xl font-bold uppercase">Make a deposit</h1>

				<div className="grid gap-2">
					<label> Phone Number </label>
					<input
						type="text"
						disabled
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						className="cursor-not-allowed rounded border-2  border-black bg-bg px-4 py-2"
					/>
				</div>

				<div className="grid gap-2">
					<label> Amount </label>
					<input
						required
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="rounded border-2 border-black bg-white px-4 py-2"
					/>
				</div>

				{/* SUBMIT */}
				<Button type="submit"> Initiate transaction </Button>
			</form>

			{/*DEPOSITS ALREADY SAVED*/}
			<DepositSection deposits={depositsQuery.data ?? []} />
		</div>
	);
}

function DepositSection({ deposits }) {
	const [searchTerm, setSearchTerm] = useState("");
	return (
		<>
			<input
				type="search"
				className="rounded-md border-2 border-black bg-white px-4 py-2"
				placeholder="Search for amount"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<section className="flex flex-col rounded-xl border-2 border-black bg-light-bg p-4">
				{deposits
					.filter((item) => {
						return item.amount.toString().includes(searchTerm);
					})
					.sort((a, b) => a?.date < b?.date)
					.map((_deposit, index) => (
						<DepositCard key={index} deposit={_deposit} />
					))}
			</section>
		</>
	);
}

function DepositCard({ deposit }) {
	return (
		<div className="flex flex-wrap justify-between gap-4 border-b-2  border-black/20 px-2 py-4 last:border-b-0">
			<div className="flex flex-col gap-2">
				<span className="text-2xl font-semibold">KES {deposit.amount}</span>
				<span>{deposit.phoneNumber}</span>
			</div>

			<div className="flex flex-col gap-2 self-end">
				<span className="text-right text-xs text-black/50">{formatDate(deposit.date)}</span>
				<span className="text-right text-sm text-black/50">{formatRelativeTime(deposit.date)}</span>
			</div>
		</div>
	);
}
