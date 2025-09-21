class Admin {
    constructor() {
        this.tableBody = document.getElementById('items-table-body');
        this.loadItems();
    }

    async loadItems() {
        try {
            const response = await fetch('/api/items');
            const items = await response.json();
            this.renderItems(items);
        } catch (error) {
            console.error('Error loading items:', error);
        }
    }

    renderItems(items) {
        this.tableBody.innerHTML = items.map(item => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${item.qr_id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${item.type}</td>
                <td class="px-6 py-4 whitespace-nowrap">${item.warranty}</td>
                <td class="px-6 py-4 whitespace-nowrap">${new Date(item.date_of_manufacture).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap">${item.manufacturer}</td>
                <td class="px-6 py-4 whitespace-nowrap">${item.status}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button onclick="admin.editItem('${item.qr_id}')" 
                            class="text-indigo-600 hover:text-indigo-900 mr-2">
                        Edit
                    </button>
                    <button onclick="admin.deleteItem('${item.qr_id}')"
                            class="text-red-600 hover:text-red-900">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async editItem(qrId) {
        try {
            const item = await this.fetchItem(qrId);
            const result = await this.showEditDialog(item);
            if (!result) return;

            const response = await fetch(`/api/items/${qrId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result)
            });

            if (!response.ok) throw new Error('Failed to update item');
            this.loadItems();

        } catch (error) {
            console.error('Error editing item:', error);
            alert('Failed to edit item');
        }
    }

    async deleteItem(qrId) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`/api/items/${qrId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete item');
            this.loadItems();

        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    }

    async fetchItem(qrId) {
        const response = await fetch(`/api/items/${qrId}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        return await response.json();
    }

    showEditDialog(item) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center';
            dialog.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h3 class="text-lg font-semibold mb-4">Edit Item</h3>
                    <form id="edit-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Type</label>
                            <select name="type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="elastic_rail_clip" ${item.type === 'elastic_rail_clip' ? 'selected' : ''}>Elastic Rail Clip</option>
                                <option value="liner" ${item.type === 'liner' ? 'selected' : ''}>Liner</option>
                                <option value="rail_pad" ${item.type === 'rail_pad' ? 'selected' : ''}>Rail Pad</option>
                                <option value="sleeper" ${item.type === 'sleeper' ? 'selected' : ''}>Sleeper</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Warranty</label>
                            <input type="text" name="warranty" value="${item.warranty}" 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Manufacturer</label>
                            <input type="text" name="manufacturer" value="${item.manufacturer}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <input type="text" name="status" value="${item.status}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" class="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                                    onclick="this.closest('.fixed').remove(); resolve(null)">
                                Cancel
                            </button>
                            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(dialog);

            dialog.querySelector('form').onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                dialog.remove();
                resolve(data);
            };
        });
    }
}

// Initialize admin interface
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new Admin();
});