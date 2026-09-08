export default function EmptyState({ message = "Your videos will show up right here" }: { message?: string }) {
    return (
        <div className="col-span-full text-sm font-semibold text-gray-400 flex flex-col items-center justify-center text-center w-full py-10">
            <p>No video yet</p>
            <p>{message}</p>
        </div>
    );
}