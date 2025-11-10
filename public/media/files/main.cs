using Splat;

public class App : Application {
  public override void Initialize() {
    AvaloniaXamlLoader.Load(this);
  }

  public override void OnFrameworkInitializationCompleted() {
    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop) {
      // Configure DI container
      var resolver = new ModernDependencyResolver();
      
      // Register services from class libraries
      resolver.RegisterLazySingleton<IService1>(() => new Service1());
      resolver.RegisterLazySingleton<IService2>(() => new Service2());
      
      // Use Splat's resolver
      Locator.CurrentMutable.InitializeSplat();
      Locator.CurrentMutable.InitializeReactiveUI();
      Locator.CurrentMutable.RegisterConstant(resolver, typeof(IMutableDependencyResolver));

      // Register the main window
      desktop.MainWindow = new MainWindow {
        DataContext = new MainWindowViewModel()
      };
    }

    base.OnFrameworkInitializationCompleted();
  }
}