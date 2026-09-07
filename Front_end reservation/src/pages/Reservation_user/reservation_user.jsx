import Bar_inic from "../../components/Bar_inc/Bar_inic";
import Reser_inic from "../../components/Reser_inic/Reser_inic";
//ver los eventos reservados del usuario buscar por id de usuario y mostrar los eventos reservados
function Reservation_user() {
  return (
    <div className="reservation_user">
      <Bar_inic />
      <Reser_inic />
    </div>
  );
}

export default Reservation_user;