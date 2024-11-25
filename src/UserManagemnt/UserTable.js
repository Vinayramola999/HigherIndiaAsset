<div className="overflow-x-auto border-b">
<table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
    <thead className=" text-black">
        <tr>
            <th className="py-2 px-4">Employee ID</th>
            <th className="py-2 px-4">User Name</th>
            <th className="py-2 px-4">Phone Number</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Department</th>
            {/* <th className="py-2 px-4">User Role</th> */}
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">User Status</th>
            <th className="py-2 px-4">Designation</th>
            <th className="py-2 px-4">Actions</th>
        </tr>
    </thead>
    <tbody>
        {users.length === 0 ? (
            <tr>
                <td colSpan="6" className="py-4 text-center">No users found</td>
            </tr>
        ) : (
            users.map((user) => (
                <tr key={user.email}>
                    <td className="py-2 px-4">{user.emp_id}</td>
                    <td className="py-2 px-4">{user.first_name} {user.last_name}</td>
                    <td className="py-2 px-4">{user.phone_no}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.dept_name}</td>
                    {/* <td className="px-4 py-2">{user.role}</td> */}
                    <td className="py-2 px-4">{user.locality}</td>
                    <td className="py-2 px-4">{user.user_status}</td>
                    <td className="py-2 px-4">{user.designation}</td>
                    <td className="py-2 px-4">
                        <button
                            className="text-red-500 hover:text-red-700 mr-2"
                            onClick={() => handleDelete(user.user_id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            onClick={() => handleEdit(user.user_id)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </td>
                </tr>
            ))
        )}
    </tbody>
</table>
</div>