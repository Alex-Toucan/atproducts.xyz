public class MainViewModel : {
  private readonly IService1 _service1;
  private readonly IService2 _service2;

  public MainViewModel(IService1 service1, IService2 service2) {
    _service1 = service1;
    _service2 = service2;
  }

  // Use _service1 and _service2 in view model logic
}