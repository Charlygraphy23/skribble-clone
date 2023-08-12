class Notify {
	#spinner(color) {
		const newDiv = document.createElement("div");
		newDiv.className = `spinner-border text-${color}`;
		newDiv.role = "status";
		return newDiv;
	}

	#autoHide(timer, div) {
		setTimeout(() => {
			document.body.removeChild(div);
		}, timer);
	}

	#addToDOM(div) {
		document.body.appendChild(div);
	}

	loading({ message, time }) {
		const container = document.createElement("div");
		container.className = "app-loading-container";

		const newSpan = document.createElement("span");
		newSpan.innerText = message;

		container.append(this.#spinner("success"));
		container.append(newSpan);

		this.#addToDOM(container);

		if (time) this.#autoHide(time, container);

		return container;
	}

	danger({ message, time }) {
		const container = document.createElement("div");
		container.className = "app-loading-container";

		const newSpan = document.createElement("span");
		newSpan.innerText = message;

		container.append(this.#spinner("danger"));
		container.append(newSpan);

		this.#addToDOM(container);

		if (time) this.#autoHide(time, container);

		return container;
	}

	close(div) {
		if (!div.className.includes("app-loading-container")) return;
		document.body.removeChild(div);
	}
}

export const AppNotification = (() => new Notify())();
