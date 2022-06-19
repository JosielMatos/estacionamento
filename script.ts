interface VeiculoProps {
  name: string;
  licence: string;
  time: Date;
}

(function () {
  const $ = (q: string) => document.querySelector(q) as HTMLInputElement;

  function convertPeriod(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000);
    return `${min}m e ${sec}s`;
  }

  function renderGarage() {
    const garage: VeiculoProps[] = getGarage();
    $("#garage").innerHTML = "";
    garage.forEach((c) => addCarToGarage(c));
  }

  function addCarToGarage(car: VeiculoProps) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${car.name}</td>
          <td>${car.licence}</td>
          <td data-time="${car.time}">
              ${new Date(car.time).toLocaleString("pt-BR", {
                hour: "numeric",
                minute: "numeric",
              })}
          </td>
          <td>
              <button class="delete">X</button>
          </td>
      `;

    $("#garage").appendChild(row);
  }

  function checkOut(info: HTMLCollection) {
    // @ts-ignore
    const time = Number(new Date().valueOf() - new Date(info[2].dataset.time as string).valueOf());
    const period = convertPeriod(time);

    const licence = info[1].textContent;
    const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu ${period} estacionado. \n\n Deseja encerrar?`;

    if (!confirm(msg)) return;

    const garage = getGarage().filter(
      (c: VeiculoProps) => c.licence !== licence
    );
    localStorage.garage = JSON.stringify(garage);

    renderGarage();
  }

  const getGarage = () =>
    localStorage.garage ? JSON.parse(localStorage.garage) : [];

  renderGarage();
  $("#send").addEventListener("click", (e) => {
    const name = $("#name").value;
    const licence = $("#licence").value;

    if (!name || !licence) {
      alert("Os campos são obrigatórios.");
      return;
    }

    const card = { name, licence, time: new Date() };

    const garage = getGarage();
    garage.push(card);

    localStorage.garage = JSON.stringify(garage);

    addCarToGarage(card);
    $("#name").value = "";
    $("#licence").value = "";
  });

  $("#garage").addEventListener("click", (e: MouseEvent | any) => {
    if (e.target.className === "delete")
      checkOut(e.target.parentElement.parentElement.cells);
  });
})();
