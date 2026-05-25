import Header from '../components/Header.jsx'
import TeacherView from '../components/TeacherView.jsx'

export default function TeacherScreen({ onBack }) {
  return (
    <div className="screen screen-pad">
      <Header eyebrow="Til læreren" name="Forløb og opsætning" onBack={onBack} showProgress={false} />
      <TeacherView onBack={onBack} />
    </div>
  )
}
